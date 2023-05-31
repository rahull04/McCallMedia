import React, {FunctionComponent, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Header, Screen} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, Logger, useTheme} from '../lib';
import {Alert, Image, StyleSheet, View} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {CameraOptions} from 'react-native-image-picker';
import {Asset} from 'react-native-image-picker';
import {addPhoto} from '../api';

const logger = new Logger({name: 'AddPhoto'});

export interface AddPhotoProps {}

const config: CameraOptions = {
  mediaType: 'photo',
};

const AddPhoto: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'AddPhoto'>
> = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [capturedImage, setCapturedImage] = useState<Asset[] | undefined>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      if (!capturedImage?.[0]?.uri) {
        return;
      }
      setLoading(true);
      await addPhoto(capturedImage?.[0]?.uri);
    } catch (err) {
      logger.error('Error while adding new voice', err);
      Alert.alert('Error while adding new photo');
    } finally {
      setLoading(false);
    }
  };

  const onCapture = async () => {
    const result = await launchCamera(config);
    setCapturedImage(result.assets);
  };

  return (
    <Screen type="fixed" header={<Header title="Person name" />}>
      <View style={styles.circle}>
        {capturedImage ? (
          <Image
            source={{uri: capturedImage?.[0]?.uri}}
            style={styles.capturedImage}
          />
        ) : (
          <Image source={theme.icon.add_image} style={styles.user} />
        )}
      </View>
      <Button title="Capture" onPress={onCapture} />
      <Button
        title="Submit"
        mode="secondary"
        onPress={onSubmit}
        disabled={!capturedImage}
        loading={loading}
      />
    </Screen>
  );
};

export default AddPhoto;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    circle: {
      width: 180,
      height: 180,
      borderColor: theme.color.black,
      borderWidth: 1,
      borderRadius: 100,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '40%',
      marginBottom: 30,
      position: 'relative',
    },
    user: {
      width: 50,
      height: 50,
    },
    capturedImage: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: 100,
      resizeMode: 'contain',
    },
    duration: {
      position: 'absolute',
      top: 10,
      alignSelf: 'center',
    },
    redButton: {
      backgroundColor: theme.color.red,
    },
  });
