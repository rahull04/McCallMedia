import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from './common';
import {GlobalThemeType, useTheme} from '../lib';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/stack.navigation';

interface EventListItemProps {
  eventName: string;
}

export const EventListItem = ({eventName}: EventListItemProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('CompanyEvent', {
          eventId: 1,
          eventName: eventName,
        });
      }}>
      <Image source={theme.icon.speaker} style={styles.speaker} />
      <View style={styles.eventContainer}>
        <Text style={styles.eventName} text={eventName} />
        <Text style={styles.companyDetail} text={eventName} />
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: 14,
      paddingVertical: 20,
      borderWidth: 1,
      borderColor: theme.color.grey,
      margin: 14,
      borderRadius: 8,
    },
    speaker: {
      width: 50,
      height: 50,
      marginRight: 20,
    },
    eventName: {
      color: theme.color.black,
      fontSize: 16,
    },
    eventContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    companyDetail: {
      color: theme.color.grey,
      fontSize: 14,
      marginTop: 6,
    },
  });
