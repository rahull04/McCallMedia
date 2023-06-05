import {useCallback, useEffect, useRef, useState} from 'react';
import {Logger, Permissions, PermissionsManager, getMMSS} from '../utils';
import {RESULTS} from 'react-native-permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {AddVoiceProps} from '../../screens/AddVoice';

const logger = new Logger({name: 'useAudio'});

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.09);

const REQUIRED_PERMISSIONS = [
  Permissions.MICROPHONE,
  Permissions.PHOTO,
  Permissions.READ_STORAGE,
];

interface RecordingData {
  recordTime: string;
  recordingUri?: string;
  totalDurationSecs?: number;
}

const MAX_RECORD_TIME = 3000;

export const useAudio = (existingVoiceNote?: AddVoiceProps['voice']) => {
  const voiceNote = useRef(existingVoiceNote);
  // Contains the recording time
  const [recordingData, setRecordingData] = useState<RecordingData>({
    recordTime: '00:00',
    recordingUri: undefined,
    totalDurationSecs: undefined,
  });
  const [recordingDuration, setRecordingDuration] = useState<number | null>(
    null,
  );
  const [isRecording, setIsRecording] = useState(false); // Informs whether recording is ON
  const [isRecordingComplete, setIsRecordingComplete] = useState(false); // Informs whether recording is complete
  // Contains audio player total recording time
  const [playBackData, setPlayBackData] = useState({
    playTime: '00:00',
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Informs whether audio player is ON
  const [snackBar, setSnackBar] = useState({
    visible: false,
    title: '',
    subtitle: '',
  });

  // Check if all the required permissions are granted by the user
  const checkPermissions = useCallback(async () => {
    let addedPermissions = 0;
    for (const permission of REQUIRED_PERMISSIONS) {
      const value = await PermissionsManager.request(permission as string);
      if (value === RESULTS.GRANTED) {
        addedPermissions++;
      }
    }
    if (addedPermissions !== REQUIRED_PERMISSIONS.length) {
      return false;
    }
    return true;
  }, []);

  const onStartRecord = useCallback(async () => {
    const areAllPermissionsGranted = await checkPermissions();
    logger.log('areAllPermissionsGranted', areAllPermissionsGranted);
    if (!areAllPermissionsGranted) {
      setSnackBar({
        visible: true,
        title: 'Error while recording the audio',
        subtitle:
          'Please grant MICROPHONE and STORAGE permissions to the app manually from the settings to proceed',
      });
      return;
    }
    setIsRecording(true);
    const uri = await audioRecorderPlayer.startRecorder();
    logger.log(`Recording uri path, ${uri}`);
    // Save audio uri to state
    setRecordingData({
      ...recordingData,
      recordingUri: uri,
    });

    // Add a listener for audio recording changes
    audioRecorderPlayer.addRecordBackListener(e => {
      // Convert mm:ss:ss to mm:ss
      const mmss = getMMSS(e.currentPosition);
      setRecordingData({
        recordingUri: uri,
        recordTime: mmss,
        totalDurationSecs: e.currentPosition,
      });
      setRecordingDuration(e.currentPosition / MAX_RECORD_TIME);
      return;
    });
  }, [checkPermissions, recordingData]);

  const onStopRecord = useCallback(async () => {
    setIsRecording(false);
    // Stop recording
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordingDuration(null);

    setIsRecordingComplete(true);
    setSnackBar({
      visible: true,
      title: 'Recording successful',
      subtitle: 'Please click on the submit button to save the recording',
    });
  }, []);

  const onStartPlay = useCallback(async () => {
    logger.log(
      'onStartPlay called for recordingUri',
      recordingData.recordingUri,
    );
    if (!recordingData.recordingUri) {
      return;
    }
    setIsAudioPlaying(true);
    const recordingMessage = await audioRecorderPlayer.startPlayer(
      recordingData.recordingUri,
    );
    logger.log('Recording started for recordingUri', recordingMessage);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (getMMSS(e.currentPosition) === recordingData.recordTime) {
        setIsAudioPlaying(false);
      }
      setPlayBackData({
        playTime: getMMSS(e.currentPosition),
      });
      setRecordingDuration(
        Math.round(
          (e.currentPosition / (recordingData?.totalDurationSecs ?? 0)) * 100,
        ),
      );
      return;
    });
  }, [
    recordingData.recordTime,
    recordingData.recordingUri,
    recordingData?.totalDurationSecs,
  ]);

  const onStopPlay = useCallback(async () => {
    logger.log('onStopPlay called');
    setIsAudioPlaying(false);
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setPlayBackData({
      playTime: '00:00',
    });
    setRecordingDuration(null);
  }, []);

  useEffect(() => {
    // Check if any voice data exists and convert write base64 voice content to file
    const writeRecodingBase64ToFile = async (
      base64Str: string,
      recordTime: string,
      totalDurationSecs: number,
    ) => {
      const filePath = `file://${RNFS.DocumentDirectoryPath}/testSound.m4a`;
      RNFS.writeFile(filePath, base64Str, 'base64').then(() => {
        setRecordingData({
          recordingUri: filePath,
          recordTime: recordTime,
          totalDurationSecs,
        });
      });
    };
    voiceNote.current &&
      writeRecodingBase64ToFile(
        voiceNote.current?.base64,
        voiceNote.current?.recordTime,
        voiceNote.current?.totalDurationSecs,
      );
    voiceNote.current = undefined;
  }, [voiceNote]);

  useEffect(() => {
    return () => {
      onStopRecord();
      onStopPlay();
    };
    // This needs to be called only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSnackBarDismiss = () => {
    setSnackBar({...snackBar, visible: false});
  };

  return {
    recordingData,
    onStartRecord,
    onStopRecord,
    onStartPlay,
    onStopPlay,
    recordingDuration,
    isRecording,
    isRecordingComplete,
    playBackData,
    isAudioPlaying,
    snackBar,
    onSnackBarDismiss,
  };
};
