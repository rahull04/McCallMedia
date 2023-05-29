import {
  View,
  Text as TextComponent,
  TextStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {GlobalThemeType, useTheme} from '../../lib';

interface TextProps {
  text?: string;
  style?: StyleProp<TextStyle>;
}

export const Text = ({text, style}: TextProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View>
      <TextComponent style={[styles.text, style]}>{text}</TextComponent>
    </View>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    text: {
      color: theme.color.darkGrey,
    },
  });
