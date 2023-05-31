import React, {FunctionComponent, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Header, Screen, Snackbar, Text} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, Logger, useTheme} from '../lib';
import {Alert, Image, Platform, StyleSheet, View} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import {addVoice} from '../api';

const logger = new Logger({name: 'AddVoice'});

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.09);

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
  });
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);

  const onStartRecord = async () => {
    setRecordingUri(null);
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${dirs.DownloadDir}/hello.mp3`,
    });
    const uri = await audioRecorderPlayer.startRecorder(path);
    setRecordingUri(uri); // Save audio uri to state

    // Add a listener for audio recording changes
    audioRecorderPlayer.addRecordBackListener(e => {
      // Convert mm:ss:ss to mm:ss
      const mmss = audioRecorderPlayer
        .mmssss(Math.floor(e.currentPosition))
        .split(':')
        .slice(0, 2)
        .join(':');
      setRecordingData({
        recordSecs: e.currentPosition,
        recordTime: mmss,
      });
      return;
    });
  };

  const onStopRecord = async () => {
    // Stop recording
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    // Reset recording data
    setRecordingData({
      recordSecs: 0,
      recordTime: '00:00',
    });
    setIsRecordingComplete(true);
    setSnackBar({
      visible: true,
      title: 'Recording saved successfully',
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

  return (
    <>
      <Screen type="fixed" header={<Header title="Person name" />}>
        <View style={styles.circle}>
          <Image
            source={
              (!isRecording && recordingUri && theme.icon.green_check) ||
              (isRecording && theme.icon.microphone_on) ||
              theme.icon.microphone_off
            }
            style={styles.microphone}
          />
          <Text
            text={recordingData?.recordTime ?? ''}
            style={styles.duration}
          />
        </View>
        <Button
          title={isRecording ? 'Stop' : 'Start'}
          style={isRecording && styles.redButton}
          onPress={() => {
            if (isRecording) {
              setIsRecording(false);
              onStopRecord();
            } else {
              setIsRecording(true);
              onStartRecord();
            }
          }}
        />
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
  });
