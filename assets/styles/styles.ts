import {StyleSheet, Platform} from 'react-native';
import {globalColors} from './color';

export const globalStyles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: globalColors.primaryColor,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  disabled: {
    opacity: 0.4,
  },
});
