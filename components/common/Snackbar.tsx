import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {Text} from './Text';
import {GlobalThemeType, useTheme} from '../../lib';

interface SnackbarType {
  showSnackBar: (visible: boolean, title: string, subTitle: string) => void;
  dismiss: () => void;
}

export type SnackbarRefType = SnackbarType | null;

export const Snackbar = forwardRef(({}, ref) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [snackBarData, setSnackBarData] = useState({
    visible: false,
    title: '',
    subTitle: '',
  });

  const onDismiss = useCallback(() => {
    setSnackBarData({
      visible: false,
      title: '',
      subTitle: '',
    });
  }, []);

  useImperativeHandle(ref, () => ({
    showSnackBar: (visible: boolean, title: string, subTitle: string) => {
      setSnackBarData({visible, title, subTitle});
    },
    dismiss: onDismiss,
  }));

  useEffect(() => {
    if (snackBarData.visible) {
      setTimeout(() => onDismiss(), 3000);
    }
  }, [snackBarData.visible, onDismiss]);

  if (!snackBarData.visible) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <Text text={snackBarData.title} style={styles.title} />
        <Text text={snackBarData.subTitle} style={styles.subTitle} />
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={onDismiss}>
        <Image style={styles.icon} source={theme.icon.closeCircle} />
      </TouchableOpacity>
    </View>
  );
});

const makeStyles = (theme: GlobalThemeType) => {
  return StyleSheet.create({
    content: {
      flex: 10,
    },
    iconContainer: {
      flex: 1,
      alignSelf: 'center',
    },
    icon: {
      width: 25,
      height: 25,
    },
    wrapper: {
      position: 'absolute',
      width: '95%',
      backgroundColor: theme.color.slateGrey,
      paddingHorizontal: theme.spacing.sizes[4],
      paddingVertical: theme.spacing.sizes[5],
      alignSelf: 'center',
      bottom: 20,
      elevation: 6,
      borderRadius: 6,
      flexDirection: 'row',
    },
    title: {
      color: theme.color.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    subTitle: {
      color: theme.color.white,
      fontSize: 14,
    },
  });
};
