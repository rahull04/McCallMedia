import {Animated, StyleSheet} from 'react-native';
import React, {FunctionComponent, useCallback, useEffect, useRef} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, useConnectionState, useStore, useTheme} from '../lib';

const Splash: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Splash'>
> = ({navigation}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const connectionState = useConnectionState();
  const fadeAnimationRef = useRef(new Animated.Value(0)).current;
  const {
    states: {
      user: {isAuthenticated},
    },
  } = useStore();

  const checkIfAuthenticated = useCallback(async () => {
    if (isAuthenticated) {
      navigation.replace('AddVoice', {});
    } else {
      navigation.replace('Login');
    }
  }, [navigation, isAuthenticated]);

  useEffect(() => {
    if (connectionState?.isConnected === null) {
      return;
    } else if (connectionState?.isConnected) {
      setTimeout(() => {
        checkIfAuthenticated();
      }, 3000);
    } else {
      navigation.replace('NoNetwork');
    }
    // This needs to be called only after we get connectionState value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState.isConnected]);

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnimationRef, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimationRef]);

  useEffect(() => fadeIn(), [fadeIn]);

  return (
    <Screen type="fixed" style={styles.screen}>
      <Animated.Image
        style={[
          styles.appIcon,
          {
            opacity: fadeAnimationRef,
          },
        ]}
        source={theme.icon.appIcon}
      />
    </Screen>
  );
};

export default Splash;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    screen: {
      backgroundColor: theme.color.white,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    appIcon: {
      width: '100%',
      height: 200,
      alignSelf: 'center',
    },
    farmer: {
      width: 300,
      height: 300,
      alignSelf: 'center',
      marginTop: theme.spacing.sizes[4],
    },
  });
