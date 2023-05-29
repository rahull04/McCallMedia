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
    <ActivityIndicator
      style={styles.container}
      size={'large'}
      animating={true}
      color={theme.color.primaryColor}
    />
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
    marginTop: '65%',
  },
  buttonLoaderContainer: {
    flex: 1,
    alignSelf: 'center',
    zIndex: 111,
  },
});
