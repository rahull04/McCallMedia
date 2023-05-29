import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from './Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GlobalThemeType, useTheme} from '../../lib';

interface ListItemProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  separator?: boolean;
}

export const ListItem = ({
  title,
  subtitle,
  onPress,
  separator,
}: ListItemProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.container, separator && styles.separatorStyle]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title} text={title} />
        {subtitle ? <Text style={styles.subtitle} text={subtitle} /> : null}
      </View>
      {onPress ? (
        <MaterialIcons
          style={styles.rightIcon}
          name="chevron-right"
          size={24}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    contentContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    title: {
      fontSize: 15,
      color: theme.color.black,
    },
    subtitle: {
      fontSize: 13,
      marginTop: 4,
    },
    rightIcon: {
      alignSelf: 'center',
    },
    separatorStyle: {
      borderBottomColor: theme.color.lightGrey,
      borderBottomWidth: 1,
    },
  });
