import React, {FunctionComponent, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Header, Screen, Text, TextInput} from '../components';
import {Image, StyleSheet} from 'react-native';
import {GlobalThemeType, Logger, useStore, useTheme} from '../lib';
import {CommonActions} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/stack.navigation';
import {loginUserRequest} from '../store';
import CheckBox from 'react-native-check-box';

export interface LoginProps {}

const logger = new Logger({name: 'Login'});

const Login: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Login'>
> = ({navigation}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const {updateState} = useStore();
  const [loginData, setLoginData] = useState({
    userName: {
      value: '',
      validation: '',
    },
    password: {
      value: '',
      validation: '',
    },
  });
  const [keepLogin, setKeepLogin] = useState(false);

  const loginButtonDisabled =
    !loginData.userName.value || !loginData.password.value;

  const onLogin = async () => {
    try {
      if (
        loginData.userName.value === '123' &&
        loginData.password.value === '123'
      ) {
        updateState(loginUserRequest, {
          userName: loginData.userName.value,
          password: loginData.password.value,
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Home'}],
          }),
        );
      }
    } catch (err) {
      logger.error('Error while initiating login for user', err);
    }
  };

  return (
    <Screen type="fixed" header={<Header />}>
      <Image source={theme.icon.appIcon} style={styles.appLogo} />
      <Text text="Login" style={styles.screenTitle} />
      <TextInput
        value={loginData.userName.value}
        label="Username"
        onChangeText={value =>
          setLoginData({
            ...loginData,
            userName: {
              ...loginData.userName,
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
      <CheckBox
        style={styles.checkBox}
        checkBoxColor={theme.color.primaryColor}
        onClick={() => {
          setKeepLogin(!keepLogin);
        }}
        isChecked={keepLogin}
        rightText={'Remember'}
      />
      <Button
        style={styles.button}
        disabled={loginButtonDisabled}
        onPress={onLogin}
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
    },
    checkBox: {
      padding: 10,
    },
  });
