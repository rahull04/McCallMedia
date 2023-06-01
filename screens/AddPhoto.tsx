import React, {FunctionComponent, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Header, Screen, Snackbar} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {
  GlobalThemeType,
  Logger,
  Permissions,
  PermissionsManager,
  useTheme,
} from '../lib';
import {Alert, Image, StyleSheet, View} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {CameraOptions, Asset} from 'react-native-image-picker';
import {addPhoto} from '../api';
import {RESULTS} from 'react-native-permissions';

const logger = new Logger({name: 'AddPhoto'});

export interface AddPhotoProps {}

const config: CameraOptions = {
  mediaType: 'photo',
};

const REQUIRED_PERMISSIONS = [Permissions.CAMERA];

const AddPhoto: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'AddPhoto'>
> = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [capturedImage, setCapturedImage] = useState<Asset[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState({
    visible: false,
    title: '',
    subtitle: '',
  });

  // Check if all the required permissions are granted by the user
  const checkPermissions = async () => {
    let addedPermissions = 0;
    for (const permission of REQUIRED_PERMISSIONS) {
      const value = await PermissionsManager.request(permission as string);
      console.log('value', value);
      if (value === RESULTS.GRANTED) {
        addedPermissions++;
      }
    }
    if (addedPermissions !== REQUIRED_PERMISSIONS.length) {
      return false;
    }
    return true;
  };

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
    logger.log('Capturing image');
    const areAllPermissionsGranted = await checkPermissions();
    logger.log('areAllPermissionsGranted', areAllPermissionsGranted);
    if (!areAllPermissionsGranted) {
      setSnackBar({
        visible: true,
        title: 'Error while launching the device camera',
        subtitle:
          'Please grant CAMERA permission to the app manually from the settings to proceed',
      });
      return;
    }
    const result = await launchCamera(config);
    logger.log('Captured image result', result);
    setCapturedImage(result.assets);
  };

  return (
    <>
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
      <Snackbar
        visible={snackBar.visible}
        onDismiss={() => setSnackBar({...snackBar, visible: false})}
        title={snackBar.title}
        subTitle={snackBar.subtitle}
      />
    </>
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
