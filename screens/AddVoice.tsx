import React, {FunctionComponent, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Header, Screen, Text} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, useTheme} from '../lib';
import {Image, Platform, StyleSheet, View} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

const audioRecorderPlayer = new AudioRecorderPlayer();

interface Data {
  recordSecs: null | number;
  recordTime: null | string;
}

export interface AddVoiceProps {}

const AddVoice: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'AddVoice'>
> = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [data, setData] = useState<Data>({
    recordSecs: null,
    recordTime: null,
  });
  const [startRecording, setStartRecording] = useState(false);

  const onStartRecord = async () => {
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: `${dirs.DocumentDir}/hello.m4a`,
      android: `${dirs.DownloadDir}/hello.mp3`,
    });
    const result = await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener(e => {
      setData({
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });
      return;
    });
    console.log(result);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setData({
      ...data,
      recordSecs: 0,
    });
    console.log(result);
  };

  return (
    <Screen type="fixed" header={<Header title="Person name" />}>
      <View style={styles.circle}>
        <Image
          source={
            startRecording
              ? theme.icon.microphone_on
              : theme.icon.microphone_off
          }
          style={styles.microphone}
        />
        <Text text={data?.recordTime ?? ''} style={styles.duration} />
      </View>
      <Button
        title={startRecording ? 'Stop' : 'Start'}
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
      <Button title="Submit" onPress={() => {}} />
    </Screen>
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
  });
