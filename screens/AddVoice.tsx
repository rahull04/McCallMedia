import React, {FunctionComponent, useState} from 'react';
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

const logger = new Logger({name: 'AddVoice'});

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.09);

const REQUIRED_PERMISSIONS = [
  Permissions.MICROPHONE,
  Permissions.PHOTO,
  Permissions.READ_STORAGE,
];

export interface AddVoiceProps {}

const AddVoice: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'AddVoice'>
> = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [recordingData, setRecordingData] = useState({
    recordSecs: 0,
    recordTime: '00:00',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [snackBar, setSnackBar] = useState({
    visible: false,
    title: '',
    subtitle: '',
  });
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [playBackData, setPlayBackData] = useState({
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00',
    duration: '00:00',
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Check if all the required permissions are granted by the user
  const checkPermissions = async () => {
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
  };

  const onStartRecord = async () => {
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
    setRecordingUri(null);
    const uri = await audioRecorderPlayer.startRecorder();
    logger.log(`Recording uri path, ${uri}`);
    setRecordingUri(uri); // Save audio uri to state

    // Add a listener for audio recording changes
    audioRecorderPlayer.addRecordBackListener(e => {
      // Convert mm:ss:ss to mm:ss
      const mmss = getMMSS(e.currentPosition);
      setRecordingData({
        recordSecs: e.currentPosition,
        recordTime: mmss,
      });
      return;
    });
  };

  const onStopRecord = async () => {
    setIsRecording(false);
    // Stop recording
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    // Reset recording data
    // setRecordingData({
    //   recordSecs: 0,
    //   recordTime: '00:00',
    // });
    setIsRecordingComplete(true);
    setSnackBar({
      visible: true,
      title: 'Recording successful',
      subtitle: 'Please click on the submit button to save the recording',
    });
  };

  const onStartPlay = async () => {
    logger.log('onStartPlay called');
    if (!recordingUri) {
      return;
    }
    setIsAudioPlaying(true);
    const recordingMessage = await audioRecorderPlayer.startPlayer(
      recordingUri,
    );
    logger.log('Recording message', recordingMessage);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (getMMSS(e.currentPosition) === recordingData.recordTime) {
        setIsAudioPlaying(false);
      }
      setPlayBackData({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: getMMSS(e.currentPosition),
        duration: getMMSS(e.duration),
      });
      return;
    });
  };

  const onStopPlay = async () => {
    logger.log('onStopPlay called');
    setIsAudioPlaying(false);
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setPlayBackData({
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00',
      duration: '00:00',
    });
  };

  const onSubmit = async () => {
    try {
      if (!recordingUri) {
        return;
      }
      setLoading(true);
      await addVoice(recordingUri);
    } catch (err) {
      logger.error('Error while adding new voice', err);
      Alert.alert('Error while adding new voice');
    } finally {
      setLoading(false);
    }
  };

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
          <TouchableOpacity onPress={() => onStartPlay()}>
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
        {isRecording || !recordingUri ? recorderView() : audioPlayerView()}
        {isRecording || !recordingUri ? (
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
