import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from './common';
import {GlobalThemeType, useTheme} from '../lib';

interface EventListItemProps {
  eventName: string;
}

export const EventListItem = ({eventName}: EventListItemProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.container}>
      <Image source={theme.icon.speaker} style={styles.speaker} />
      <Text style={styles.eventName} text={eventName} />
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
    },
  });
