import React, {FunctionComponent, useCallback, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Header, Screen, Snackbar, Text} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, Logger, useTheme} from '../lib';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {CircularProgressBar} from '../components';
import {useAudio} from '../lib/hooks/useAudio';
import {addVoice} from '../api';

const logger = new Logger({name: 'AddVoice'});

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.09);

export interface AddVoiceProps {
  voice?: {
    base64: string;
    recordTime: string;
    totalDurationSecs: number;
  };
}

const AddVoice: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'AddVoice'>
> = ({route}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const {
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
  } = useAudio(route.params.voice);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      if (!recordingData.recordingUri || !recordingData.totalDurationSecs) {
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
        totalDurationSecs: recordingData.totalDurationSecs,
      });
    } catch (err) {
      logger.error('Error while adding new voice', err);
      Alert.alert('Error while adding new voice');
    } finally {
      setLoading(false);
    }
  }, [
    recordingData.recordTime,
    recordingData.recordingUri,
    recordingData.totalDurationSecs,
  ]);

  const _recorderView = () => (
    <>
      <Image
        source={
          (isRecording && theme.icon.microphone_on) || theme.icon.microphone_off
        }
        style={styles.microphone}
      />
      <Text text={recordingData?.recordTime ?? ''} style={styles.duration} />
    </>
  );

  const _audioPlayerView = () => (
    <>
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
    </>
  );

  return (
    <>
      <Screen
        type="fixed"
        header={<Header title="Person name" showCloseIcon={true} />}>
        <View style={styles.circleContainer}>
          <CircularProgressBar
            size={240}
            strokeWidth={18}
            progressPercent={recordingDuration ?? 0}
            children={
              isRecording || !recordingData?.recordingUri
                ? _recorderView()
                : _audioPlayerView()
            }
          />
        </View>
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
        onDismiss={onSnackBarDismiss}
        title={snackBar.title}
        subTitle={snackBar.subtitle}
      />
    </>
  );
};

export default AddVoice;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    circleContainer: {
      width: '100%',
      alignItems: 'center',
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
      zIndex: 5,
    },
  });
