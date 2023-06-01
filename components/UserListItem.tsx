import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from './common';
import {GlobalThemeType, useTheme} from '../lib';

interface UserListItemProps {
  eventName: string;
  onEdit?(): void;
}

export const UserListItem = ({eventName, onEdit}: UserListItemProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.container}>
      <Image source={theme.icon.speaker} style={styles.speaker} />
      <Text style={styles.eventName} text={eventName} />
      <TouchableOpacity
        style={styles.childContainer}
        onPress={() => {
          onEdit && onEdit();
        }}>
        <Text style={styles.edit} text={'Edit'} />
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.color.black,
      margin: 14,
    },
    speaker: {
      width: 50,
      height: 50,
      marginRight: 20,
    },
    eventName: {
      color: theme.color.black,
      fontSize: 18,
      marginTop: 12,
      flex: 1,
    },
    edit: {
      color: theme.color.black,
      fontSize: 18,
      marginTop: 12,
    },
    childContainer: {
      flex: 1,
      flexDirection: 'row',
    },
  });
