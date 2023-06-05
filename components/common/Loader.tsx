import {StyleSheet, View} from 'react-native';
import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {useTheme} from '../../lib';

interface ButtonLoaderProps {
  color?: string;
}

export const Loader = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={'large'}
        style={styles.loader}
        animating={true}
        color={theme.color.primaryColor}
      />
    </View>
  );
};

export const ButtonLoader = ({color}: ButtonLoaderProps) => {
  return (
    <View style={styles.buttonLoaderContainer}>
      <ActivityIndicator animating={true} color={color ?? 'white'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 111,
  },
  loader: {
    top: '35%',
  },
  buttonLoaderContainer: {
    flex: 1,
    alignSelf: 'center',
    zIndex: 111,
    paddingVertical: 10,
  },
});
