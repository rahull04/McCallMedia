import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Header, Screen, Snackbar, Text} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {
  GlobalThemeType,
  Logger,
  Permissions,
  PermissionsManager,
  getMMSS,
  useTheme,
} from '../lib';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {addVoice} from '../api';
import {RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';

const logger = new Logger({name: 'AddVoice'});

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
}

export interface AddVoiceProps {
  voice?: {
    base64: string;
    recordTime: string;
  };
}

const AddVoice: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'AddVoice'>
> = ({route}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  let voiceNote = useRef(route.params.voice);
  // Contains the recording time
  const [recordingData, setRecordingData] = useState<RecordingData>({
    recordTime: '00:00',
    recordingUri: undefined,
  });
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
  const [loading, setLoading] = useState(false);

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
      });
      return;
    });
  }, [checkPermissions, recordingData]);

  const onStopRecord = useCallback(async () => {
    setIsRecording(false);
    // Stop recording
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

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
      return;
    });
  }, [recordingData.recordTime, recordingData.recordingUri]);

  const onStopPlay = useCallback(async () => {
    logger.log('onStopPlay called');
    setIsAudioPlaying(false);
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setPlayBackData({
      playTime: '00:00',
    });
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      if (!recordingData.recordingUri) {
        return;
      }
      setLoading(true);
      // Convert file to base64 format
      const base64Recording = await RNFS.readFile(
        recordingData.recordingUri,
        'base64',
      );
      logger.log('base64Recording to be submitted', base64Recording);
      await addVoice({
        recordTime: recordingData.recordTime,
        base64: base64Recording,
      });
    } catch (err) {
      logger.error('Error while adding new voice', err);
      Alert.alert('Error while adding new voice');
    } finally {
      setLoading(false);
    }
  }, [recordingData.recordTime, recordingData.recordingUri]);

  useEffect(() => {
    // Check if any voice data exists and convert write base64 voice content to file
    const writeRecodingBase64ToFile = async (
      base64Str: string,
      recordTime: string,
    ) => {
      const filePath = `file://${RNFS.DocumentDirectoryPath}/testSound.m4a`;
      RNFS.writeFile(filePath, base64Str, 'base64').then(() => {
        setRecordingData({
          recordingUri: filePath,
          recordTime: recordTime,
        });
      });
    };
    voiceNote.current &&
      writeRecodingBase64ToFile(
        voiceNote.current?.base64,
        voiceNote.current?.recordTime,
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

  const recorderView = () => (
    <View style={styles.circle}>
      <Image
        source={
          (isRecording && theme.icon.microphone_on) || theme.icon.microphone_off
        }
        style={styles.microphone}
      />
      <Text text={recordingData?.recordTime ?? ''} style={styles.duration} />
    </View>
  );

  const audioPlayerView = () => (
    <View style={styles.circle}>
      <View>
        <Text
          text={
            `${playBackData?.playTime} / ${recordingData?.recordTime}` ?? ''
          }
          style={styles.playStopDuration}
        />
      </View>
      <View style={styles.playStopContainer}>
        {isAudioPlaying ? (
          <TouchableOpacity onPress={() => onStopPlay()}>
            <Image source={theme.icon.stop_black} style={styles.playStop} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              onStartPlay();
            }}>
            <Image source={theme.icon.play_black} style={styles.playStop} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <>
      <Screen
        type="fixed"
        header={<Header title="Person name" showCloseIcon={true} />}>
        {isRecording || !recordingData?.recordingUri
          ? recorderView()
          : audioPlayerView()}
        {isRecording || !recordingData?.recordingUri ? (
          <Button
            title={isRecording ? 'Stop' : 'Start'}
            style={isRecording && styles.redButton}
            onPress={() => {
              if (isRecording) {
                onStopRecord();
              } else {
                onStartRecord();
              }
            }}
          />
        ) : (
          <Button
            title={isRecording ? 'Stop' : 'Record again'}
            style={isRecording && styles.redButton}
            onPress={() => {
              if (isRecording) {
                onStopRecord();
              } else {
                logger.log('Record again called');
                onStopPlay();
                onStartRecord();
              }
            }}
          />
        )}
        <Button
          title="Submit"
          mode="secondary"
          disabled={!isRecordingComplete}
          loading={loading}
          onPress={onSubmit}
        />
      </Screen>
      <Snackbar
        visible={snackBar.visible}
        onDismiss={() => setSnackBar({...snackBar, visible: false})}
        title={snackBar.title}
        subTitle={snackBar.subtitle}
      />
    </>
  );
};

export default AddVoice;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    circle: {
      width: 180,
      height: 180,
      borderColor: theme.color.black,
      borderWidth: 1,
      borderRadius: 100,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '40%',
      marginBottom: 30,
      position: 'relative',
    },
    microphone: {
      width: 50,
      height: 50,
    },
    duration: {
      position: 'absolute',
      top: 10,
      alignSelf: 'center',
    },
    redButton: {
      backgroundColor: theme.color.red,
    },
    playStopDuration: {
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
    },
    playStop: {
      width: 50,
      height: 50,
      marginHorizontal: 10,
    },
    playStopContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 30,
    },
  });
