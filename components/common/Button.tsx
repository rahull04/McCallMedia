import React, {useMemo} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {Text} from './Text';
import {ButtonLoader} from './Loader';
import {GlobalThemeType, useTheme} from '../../lib';

export type ButtonModes = 'primary' | 'secondary' | 'tertiary' | 'yellow';

interface ButtonProps {
  titleTx?: string;
  title?: string;
  titleTxOptions?: object;
  mode?: ButtonModes;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  loaderColor?: string;
}

export const Button = ({
  title,
  mode = 'primary',
  onPress,
  style,
  textStyle,
  disabled,
  loading,
  loaderColor,
}: ButtonProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const showDisabledUI = disabled || loading;
  const disabledStyle =
    showDisabledUI &&
    (mode === 'yellow' ? styles.yellowDisabledStyle : theme.styles.disabled);

  const buttonStyle = useMemo(() => {
    return {
      button: styles[mode as keyof typeof styles],
      text: styles[`${mode}Text` as keyof typeof styles],
    };
  }, [mode, styles]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle.button as StyleProp<ViewStyle>,
        style,
        disabledStyle,
      ]}
      disabled={showDisabledUI}
      onPress={() => !showDisabledUI && onPress()}>
      {loading ? (
        <ButtonLoader
          color={mode === 'secondary' ? theme.color.primaryColor : loaderColor}
        />
      ) : (
        <Text
          style={[
            buttonStyle.text,
            textStyle,
            showDisabledUI &&
              mode === 'yellow' &&
              styles.yellowTextDisabledStyle,
          ]}
          text={title}
        />
      )}
    </TouchableOpacity>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    primary: {
      backgroundColor: theme.color.primaryColor,
      color: 'white',
      alignItems: 'center',
      margin: 12,
      borderRadius: 6,
      paddingVertical: 14,
    },
    primaryText: {
      color: theme.color.white,
    },
    secondary: {
      backgroundColor: theme.color.white,
      alignItems: 'center',
      margin: 12,
      borderRadius: 6,
      paddingVertical: 14,
      borderColor: theme.color.primaryColor,
      borderWidth: 1,
    },
    secondaryText: {
      color: theme.color.primaryColor,
    },
    tertiary: {
      padding: 0,
    },
    tertiaryText: {
      color: theme.color.primaryColor,
    },
    yellow: {
      padding: 0,
      backgroundColor: theme.color.secondaryColor,
      margin: 12,
      borderRadius: 6,
      paddingVertical: 14,
      alignItems: 'center',
    },
    yellowText: {
      color: theme.color.primaryColor,
    },
    button: {
      padding: 12,
    },
    yellowDisabledStyle: {
      backgroundColor: theme.color.yellow3,
      borderColor: theme.color.lightGrey2,
      borderWidth: 1,
    },
    yellowTextDisabledStyle: {
      color: theme.color.grey2,
    },
  });
