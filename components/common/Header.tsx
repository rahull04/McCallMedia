import React, {useMemo} from 'react';
import {Appbar} from 'react-native-paper';
import {GlobalThemeType, useTheme} from '../../lib';
import {StyleSheet} from 'react-native';
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

export const Header = ({title, showAppName = false}: HeaderProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const titleValue = useMemo(() => {
    if (showAppName) {
      return <Text text="Exhibitor Company" style={styles.appName} />;
    }
    return title;
  }, [showAppName, title, styles.appName]);

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content title={titleValue} titleStyle={styles.title as any} />
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
      alignSelf: 'center',
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
      alignSelf: 'center',
      fontSize: 20,
      fontWeight: '500',
    },
  });
