import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StatusBarStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Header} from './Header';
import {GlobalThemeType, useTheme} from '../../lib';

export interface ScreenProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  header?: ReturnType<typeof Header>;
  type?: 'fixed' | 'scroll';
}

const isIos = Platform.OS === 'ios';

export const Screen = ({children, style, header, type}: ScreenProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const barStyle = Platform.select({
    ios: 'dark-content',
    default: 'light-content',
  }) as StatusBarStyle;

  const renderContent = () => {
    if (type === 'fixed') {
      return <View style={[styles.inner, style]}>{children}</View>;
    }
    return (
      <ScrollView
        style={[styles.inner, style]}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {children}
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={isIos ? 'padding' : undefined}>
      <StatusBar barStyle={barStyle} />
      <View>
        {header}
        <View>{renderContent()}</View>
      </View>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    inner: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.color.white,
    },
    outer: {
      width: '100%',
      height: '100%',
      flex: 1,
    },
    contentContainerStyle: {
      paddingBottom: 120,
    },
  });
