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
  const [data, setData] = useState({
    recordSecs: 0,
    recordTime: '00:00',
  });
  const [startRecording, setStartRecording] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState({
    visible: false,
    title: '',
  });
  const [recording, setRecording] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);

  const onStartRecord = async () => {
    setRecording(null);
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${dirs.DownloadDir}/hello.mp3`,
    });
    const uri = await audioRecorderPlayer.startRecorder(path);
    setRecording(uri);
    audioRecorderPlayer.addRecordBackListener(e => {
      const mmss = audioRecorderPlayer
        .mmssss(Math.floor(e.currentPosition))
        .split(':')
        .slice(0, 2)
        .join(':');
      setData({
        recordSecs: e.currentPosition,
        recordTime: mmss,
      });
      return;
    });
  };

  const onStopRecord = async () => {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setData({
      recordSecs: 0,
      recordTime: '00:00',
    });
    setRecordingComplete(true);
    setShowSnackBar({
      visible: true,
      title: 'Recording saved successfully',
    });
  };

  const onSubmit = async () => {
    try {
      if (!recording) {
        return;
      }
      setLoading(true);
      await addVoice(recording);
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
              (!startRecording && recording && theme.icon.green_check) ||
              (startRecording && theme.icon.microphone_on) ||
              theme.icon.microphone_off
            }
            style={styles.microphone}
          />
          <Text text={data?.recordTime ?? ''} style={styles.duration} />
        </View>
        <Button
          title={startRecording ? 'Stop' : 'Start'}
          style={startRecording && styles.redButton}
          onPress={() => {
            if (startRecording) {
              setStartRecording(false);
              onStopRecord();
            } else {
              setStartRecording(true);
              onStartRecord();
            }
          }}
        />
        <Button
          title="Submit"
          mode="secondary"
          disabled={!recordingComplete}
          loading={loading}
          onPress={onSubmit}
        />
      </Screen>
      <Snackbar
        visible={showSnackBar.visible}
        onDismiss={() => setShowSnackBar({...showSnackBar, visible: false})}
        title={showSnackBar.title}
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
