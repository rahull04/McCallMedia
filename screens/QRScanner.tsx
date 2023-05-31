import React, {FunctionComponent} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Header, Screen} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, useTheme} from '../lib';
import {Alert, StyleSheet, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

export interface LoginProps {}

const QRScanner: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'QRScanner'>
> = ({navigation}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  // const onSuccess = (e: any) => {
  //   Linking.openURL(e.data).catch(err =>
  //     console.error('An error occured', err)
  //   );
  // };

  return (
    <Screen type="fixed" header={<Header showAppName={true} />}>
      <View style={styles.container}>
        <QRCodeScanner
          onRead={() => {
            Alert.alert('Success');
          }}
          flashMode={RNCamera.Constants.FlashMode.torch}
        />
      </View>
    </Screen>
  );
};

export default QRScanner;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: theme.spacing.sizes[7],
    },
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777',
    },
    textBold: {
      fontWeight: '500',
      color: '#000',
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
      padding: 16,
    },
  });
