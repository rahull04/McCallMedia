import React, {FunctionComponent, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Header, Screen, TextInput} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, Logger, useTheme} from '../lib';
import {Alert, StyleSheet} from 'react-native';
import {addDetails} from '../api';

const logger = new Logger({name: 'AddDetails'});

export interface AddDetailsProps {
  eventId: number;
  eventName: string;
  userName: string;
  companyName: string;
}

const AddDetails: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'AddDetails'>
> = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [details, setDetails] = useState({
    name: {
      value: '',
      validation: '',
    },
    company: {
      value: '',
      validation: '',
    },
    position: {
      value: '',
      validation: '',
    },
    location: {
      value: '',
      validation: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const submitButtonDisabled =
    !details.name.value ||
    !details.company.value ||
    !details.position.value ||
    !details.location.value;

  const onSubmit = async () => {
    try {
      if (
        !details.name.value ||
        !details.company.value ||
        !details.position.value ||
        !details.location.value
      ) {
        return;
      }
      setLoading(true);
      await addDetails({
        name: details.name.value,
        company: details.company.value,
        position: details.position.value,
        location: details.location.value,
      });
    } catch (err) {
      logger.error('Error while adding new voice', err);
      Alert.alert('Error while adding new details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      type="fixed"
      style={styles.screen}
      header={<Header title="Person name" showCloseIcon={true} />}>
      <TextInput
        value={details.name.value}
        containerStyle={styles.input}
        label="Name"
        onChangeText={value =>
          setDetails({
            ...details,
            name: {
              ...details.name,
              value: value,
            },
          })
        }
      />
      <TextInput
        value={details.company.value}
        label="Company"
        onChangeText={value =>
          setDetails({
            ...details,
            company: {
              ...details.company,
              value: value,
            },
          })
        }
      />
      <TextInput
        value={details.position.value}
        label="Position"
        onChangeText={value =>
          setDetails({
            ...details,
            position: {
              ...details.position,
              value: value,
            },
          })
        }
      />
      <TextInput
        value={details.location.value}
        label="Location"
        onChangeText={value =>
          setDetails({
            ...details,
            location: {
              ...details.location,
              value: value,
            },
          })
        }
      />
      <Button
        style={styles.button}
        disabled={submitButtonDisabled}
        loading={loading}
        onPress={onSubmit}
        title="Submit"
      />
    </Screen>
  );
};

export default AddDetails;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    screenTitle: {
      fontSize: theme.spacing.sizes[7],
      textAlign: 'center',
      color: theme.color.black,
    },
    button: {
      marginTop: 25,
    },
    appLogo: {
      width: 80,
      height: 80,
      alignSelf: 'center',
      marginBottom: theme.spacing.sizes[4],
    },
    screen: {
      padding: 8,
    },
    input: {
      marginTop: 32,
    },
  });
