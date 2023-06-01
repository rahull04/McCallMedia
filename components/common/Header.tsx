import React, {useMemo} from 'react';
import {GlobalThemeType, useTheme} from '../../lib';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from './Text';
import {useNavigation} from '@react-navigation/native';

interface ButtonItem {
  icon: 'back' | 'close';
  onPress: () => void;
}

interface HeaderProps {
  readonly title?: string;
  readonly showBackIcon?: boolean;
  readonly rightButtons?: ButtonItem[];
  readonly showAppName?: boolean;
}

export const Header = ({
  title,
  showAppName = false,
  showBackIcon,
}: HeaderProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation();

  const titleValue = useMemo(() => {
    if (showAppName) {
      return 'Exhibitor Company';
    }
    return title;
  }, [showAppName, title]);

  return (
    <View style={styles.header}>
      {showBackIcon ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={theme.icon.back_arrow} style={styles.backArrow} />
        </TouchableOpacity>
      ) : null}
      <View style={styles.titleContainer}>
        <Text text={titleValue} style={styles.title} />
      </View>
    </View>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.color.primaryColor,
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
    },
    button: {
      marginRight: theme.spacing.sizes[4],
    },
    titleContainer: {
      position: 'absolute',
      left: '32%',
    },
    title: {
      fontSize: theme.spacing.sizes[5],
      fontWeight: 'bold',
      color: theme.color.white,
    },
    rightButtonsContainer: {
      marginRight: 8,
    },
    appIcon: {
      width: 60,
      height: 40,
    },
    appName: {
      alignSelf: 'center',
      fontSize: 20,
      fontWeight: '500',
      color: theme.color.white,
    },
    backArrow: {
      width: 35,
      height: 35,
      marginLeft: 16,
    },
  });
