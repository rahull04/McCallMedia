import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {Text} from './Text';
import {GlobalThemeType, useTheme} from '../../lib';

interface SnackbarProps {
  visible: boolean;
  title?: string;
  subTitle?: string;
  onDismiss: () => void;
}

export const Snackbar = ({
  visible,
  title,
  subTitle,
  onDismiss,
}: SnackbarProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  useEffect(() => {
    if (visible) {
      setTimeout(() => onDismiss(), 3000);
    }
  }, [visible, onDismiss]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <Text text={title} style={styles.title} />
        <Text text={subTitle} style={styles.subTitle} />
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={onDismiss}>
        <Image style={styles.icon} source={theme.icon.closeCircle} />
      </TouchableOpacity>
    </View>
  );
};

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
