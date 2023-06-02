import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from './common';
import {GlobalThemeType, useTheme} from '../lib';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/stack.navigation';

interface CheckedInListItemProps {
  eventName: string;
}

export const CheckedInListItem = ({eventName}: CheckedInListItemProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.eventName} text={eventName} />
      <Text style={styles.companyName} text={'Company name'} />
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('AddPhoto', {})}>
          <Image source={theme.icon.camera_black} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AddVoice', {})}>
          <Image source={theme.icon.microphone_on} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddDetails', {
              eventId: 1,
              eventName: eventName,
              userName: 'test',
              companyName: 'Company 1',
            })
          }>
          <Image source={theme.icon.edit_black} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 14,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: theme.color.grey,
      margin: 14,
      borderRadius: 6,
    },
    eventName: {
      color: theme.color.black,
      fontSize: 16,
      marginTop: 8,
      flex: 1,
    },
    companyName: {
      color: theme.color.grey,
      fontSize: 14,
      marginTop: 4,
    },
    icon: {
      width: 20,
      height: 20,
      marginHorizontal: 10,
    },
    iconContainer: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  });
