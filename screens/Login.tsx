import React, {FunctionComponent, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Screen, Text, TextInput} from '../components';
import {Image, StyleSheet} from 'react-native';
import {GlobalThemeType, Logger, useStore, useTheme} from '../lib';
import {CommonActions} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/stack.navigation';
import {loginUserRequest} from '../store';
import {login} from '../api';

export interface LoginProps {}

const logger = new Logger({name: 'Login'});

const Login: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Login'>
> = ({navigation}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const {updateState} = useStore();
  const [loginData, setLoginData] = useState({
    email: {
      value: 'vicky.codeaddict@gmail.com',
      validation: '',
    },
    password: {
      value: 'vivek123',
      validation: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const loginButtonDisabled =
    !loginData.email.value || !loginData.password.value;

  const onLogin = async () => {
    try {
      setLoading(true);
      const token = await login({
        email: loginData.email.value,
        password: loginData.password.value,
      });
      logger.log('Authentication token', token);
      updateState(loginUserRequest, {
        email: loginData.email.value,
        token: token,
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Home'}],
        }),
      );
    } catch (err) {
      logger.error('Error while initiating login for user', err);
    } finally {
      setLoading(true);
    }
  };

  return (
    <Screen type="fixed">
      <Image source={theme.icon.appIcon} style={styles.appLogo} />
      <Text text="Login" style={styles.screenTitle} />
      <TextInput
        value={loginData.email.value}
        label="Username"
        onChangeText={value =>
          setLoginData({
            ...loginData,
            email: {
              ...loginData.email,
              value: value,
            },
          })
        }
      />
      <TextInput
        value={loginData.password.value}
        label="Password"
        secureTextEntry={true}
        onChangeText={value =>
          setLoginData({
            ...loginData,
            password: {
              ...loginData.password,
              value: value,
            },
          })
        }
      />
      <Button
        style={styles.button}
        disabled={loginButtonDisabled}
        onPress={onLogin}
        loading={loading}
        title="Sign in"
      />
    </Screen>
  );
};

export default Login;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    screenTitle: {
      fontSize: theme.spacing.sizes[7],
      textAlign: 'center',
      color: theme.color.black,
    },
    button: {
      marginBottom: 15,
    },
    appLogo: {
      width: 200,
      height: 80,
      alignSelf: 'center',
      marginVertical: theme.spacing.sizes[4],
      marginTop: 32,
    },
    checkBox: {
      padding: 10,
    },
  });
