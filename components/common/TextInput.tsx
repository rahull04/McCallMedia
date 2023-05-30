import React, {forwardRef} from 'react';
import {TextInput as TextInputComponent} from 'react-native-paper';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  TextInput as V2TextInput,
} from 'react-native';
import {Text} from './Text';
import {GlobalThemeType, useTheme} from '../../lib';

export type TextInputType =
  | 'default'
  | 'numeric'
  | 'email-address'
  | 'ascii-capable'
  | 'numbers-and-punctuation'
  | 'url'
  | 'number-pad'
  | 'phone-pad'
  | 'name-phone-pad'
  | 'decimal-pad'
  | 'twitter'
  | 'web-search'
  | 'visible-password';

interface TextInputProps {
  label?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  mode?: 'flat' | 'outlined';
  value?: unknown;
  onChangeText: (value: any) => void;
  validationText?: string;
  type?: TextInputType;
  maxLength?: number;
  onPressIn?: () => void;
  leftIcon?: 'calendar';
  required?: boolean;
  validationStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  textColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  version?: 'v1' | 'v2';
  secureTextEntry?: boolean;
}

export const TextInput = forwardRef(
  (
    {
      label,
      style,
      mode,
      type,
      value,
      onChangeText,
      validationText,
      maxLength,
      labelStyle,
      onPressIn,
      leftIcon,
      required,
      validationStyle,
      disabled = false,
      textColor,
      containerStyle,
      version = 'v1',
      secureTextEntry,
    }: TextInputProps,
    ref,
  ) => {
    const theme = useTheme();
    const styles = makeStyles(theme);

    if (version === 'v2') {
      return (
        <V2TextInput
          value={value as string}
          style={[styles.input, style]}
          onChangeText={onChangeText}
          maxLength={maxLength}
          onPressIn={onPressIn}
          keyboardType={type}
          ref={ref as any}
        />
      );
    }

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <View style={styles.labelContainer}>
            <Text style={[styles.label, labelStyle]} text={label} />
            {required ? <Text style={[styles.asterisk]} text={'*'} /> : null}
          </View>
        ) : null}
        <TextInputComponent
          outlineStyle={styles.outlineStyle}
          value={value as string}
          mode={mode ?? 'outlined'}
          disabled={disabled}
          keyboardType={type}
          style={[styles.input, style]}
          textColor={textColor}
          onChangeText={onChangeText}
          maxLength={maxLength}
          onPressIn={onPressIn}
          ref={ref as any}
          secureTextEntry={secureTextEntry}
          left={
            leftIcon && (
              <TextInputComponent.Icon
                style={styles.leftIcon}
                icon={leftIcon}
                onPress={onPressIn}
                size={22}
              />
            )
          }
        />
        {validationText ? (
          <Text
            text={validationText}
            style={[styles.errorMsg, validationStyle]}
          />
        ) : null}
      </View>
    );
  },
);

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    container: {
      margin: 10,
    },
    input: {
      backgroundColor: theme.color.white2,
      borderRadius: 16,
      margin: 0,
    },
    label: {
      color: theme.color.black,
    },
    labelContainer: {
      flexDirection: 'row',
    },
    outlineStyle: {
      borderRadius: 6,
    },
    errorMsg: {
      fontSize: 12,
      color: 'red',
      marginLeft: 10,
      marginTop: -12,
    },
    leftIcon: {
      paddingTop: 4,
    },
    asterisk: {
      color: 'red',
      marginLeft: 4,
      marginTop: 2,
    },
  });
