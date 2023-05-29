import React, {FunctionComponent, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button} from '../components';
import {StyleSheet, View} from 'react-native';
import {GlobalThemeType, Logger, useTheme} from '../lib';
import {CommonActions} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/stack.navigation';
export interface LoginProps {}

const logger = new Logger({name: 'SignUp'});

const Login: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Login'>
> = ({navigation}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [loginData, setLoginData] = useState({
    phone: {
      value: '',
      validation: '',
    },
  });

  const onLogin = async () => {
    try {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'HomeTab'}],
        }),
      );
    } catch (err) {
      logger.error('Error while initiating login for user', err);
    }
  };

  return (
    <View>
      <Button style={styles.button} onPress={onLogin} title="Login" />
    </View>
  );
};

export default Login;

const makeStyles = (_theme: GlobalThemeType) =>
  StyleSheet.create({
    forgotPassword: {
      width: '100%',
      textAlign: 'center',
      marginBottom: 15,
    },
    signupContainer: {
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    signUpButton: {
      marginLeft: 8,
    },
    signUpButtonText: {
      fontWeight: '600',
    },
    inputText: {
      marginBottom: 20,
      width: 250,
    },
    inputText2: {
      marginBottom: 20,
    },
    button: {
      marginBottom: 15,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
  });
