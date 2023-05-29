import React, {useMemo} from 'react';
import {Appbar} from 'react-native-paper';
import {GlobalThemeType, useTheme} from '../../lib';
import {StyleSheet, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text} from './Text';

interface ButtonItem {
  icon: 'back' | 'close';
  onPress: () => void;
}

interface HeaderProps {
  readonly title?: string;
  readonly leftButtons?: ButtonItem[];
  readonly rightButtons?: ButtonItem[];
  readonly showAppName?: boolean;
}

const getIcon = (icon: string, onPress: () => void) => {
  switch (icon) {
    case 'back':
      return <Appbar.BackAction key={icon} onPress={onPress} />;
    case 'close':
      return (
        <MaterialIcons key={icon} name="close" size={24} onPress={onPress} />
      );
    default:
      null;
  }
};

export const Header = ({
  title,
  leftButtons,
  rightButtons,
  showAppName = false,
}: HeaderProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const titleValue = useMemo(() => {
    if (showAppName) {
      return <Text text="App name" />;
    }
    return title;
  }, [showAppName, title]);

  return (
    <Appbar.Header style={styles.header}>
      {leftButtons?.map(button => getIcon(button.icon, button.onPress))}
      <Appbar.Content title={titleValue} titleStyle={styles.title as any} />
      <View style={styles.rightButtonsContainer}>
        {rightButtons?.map(button => getIcon(button.icon, button.onPress))}
      </View>
    </Appbar.Header>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.color.white,
    },
    button: {
      marginRight: theme.spacing.sizes[4],
    },
    title: {
      fontSize: theme.spacing.sizes[5],
      fontWeight: 'bold',
      color: theme.color.dark,
    },
    rightButtonsContainer: {
      marginRight: 8,
    },
    info: {
      height: 25,
      width: 25,
      marginRight: 12,
    },
    appIcon: {
      width: 60,
      height: 40,
    },
    appName: {
      height: 20,
      width: 80,
    },
  });
