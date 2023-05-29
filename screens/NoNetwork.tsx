import {StyleSheet} from 'react-native';
import React, {FunctionComponent} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, useTheme} from '../lib';

const NoNetwork: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'NoNetwork'>
> = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return <Screen type="fixed" style={styles.screen}></Screen>;
};

export default NoNetwork;

const makeStyles = (_theme: GlobalThemeType) =>
  StyleSheet.create({
    screen: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    noInternet: {
      width: 300,
      height: 300,
      alignSelf: 'center',
      marginVertical: 10,
    },
  });
