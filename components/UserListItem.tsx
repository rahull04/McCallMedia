import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from './common';
import {GlobalThemeType, useTheme} from '../lib';

interface UserListItemProps {
  userName: string;
}

export const UserListItem = ({userName}: UserListItemProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.eventName} text={userName} />
      <Text style={styles.companyName} text={'Company name'} />
    </View>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.color.black,
      margin: 14,
    },
    eventName: {
      color: theme.color.black,
      fontSize: 18,
      marginTop: 12,
    },
    companyName: {
      color: theme.color.black,
      fontSize: 14,
      marginTop: 4,
    },
  });
