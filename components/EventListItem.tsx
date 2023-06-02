import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from './common';
import {GlobalThemeType, useTheme} from '../lib';

interface EventListItemProps {
  eventName: string;
  onPress?(): void;
}

export const EventListItem = ({eventName, onPress}: EventListItemProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.childContainer}
        onPress={() => {
          onPress && onPress();
        }}>
        <Image source={theme.icon.speaker} style={styles.speaker} />
        <View style={styles.eventContainer}>
          <Text style={styles.eventName} text={eventName} />
          <Text style={styles.companyDetail} text={eventName} />
        </View>
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
    },
    childContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    eventContainer: {
      flex: 1,
      flexDirection: 'column',
      alignContent: 'center',
    },
    companyDetail: {
      color: theme.color.black,
      fontSize: 12,
      marginTop: 6,
    },
  });
