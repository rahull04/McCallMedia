import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import {CameraOptions} from 'react-native-image-picker';
import {addPhoto} from '../api';
import {RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';

const logger = new Logger({name: 'AddPhoto'});

export interface AddPhotoProps {
  image?: {
    base64: string;
    fileName: string;
  };
}

export interface CapturedImage {
  uri?: string;
  base64?: string;
  fileName?: string;
}

const config: CameraOptions = {
  mediaType: 'photo',
  includeBase64: true,
};

const REQUIRED_PERMISSIONS = [Permissions.CAMERA];

const AddPhoto: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'AddPhoto'>
> = ({route}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  let imageData = useRef(route.params.image);

  const [capturedImage, setCapturedImage] = useState<CapturedImage>({
    uri: undefined,
    base64: undefined,
    fileName: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState({
    visible: false,
    title: '',
    subtitle: '',
  });

  // Check if all the required permissions are granted by the user
  const checkPermissions = useCallback(async () => {
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
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      if (!capturedImage?.base64 || !capturedImage?.fileName) {
        return;
      }
      setLoading(true);
      logger.log('base64Image to be submitted', capturedImage?.base64);
      await addPhoto({
        base64: capturedImage?.base64,
        fileName: capturedImage?.fileName,
      });
    } catch (err) {
      logger.error('Error while adding new voice', err);
      Alert.alert('Error while adding new photo');
    } finally {
      setLoading(false);
    }
  }, [capturedImage]);

  const onCapture = useCallback(async () => {
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
    setCapturedImage({
      uri: result.assets?.[0]?.uri,
      base64: result.assets?.[0]?.base64,
      fileName: result.assets?.[0]?.fileName,
    });
    setSnackBar({
      visible: true,
      title: 'Image captured successfully',
      subtitle: 'Please click on the submit button to save the image',
    });
  }, [checkPermissions]);

  useEffect(() => {
    // Check if any image data exists and write base64 image content to file
    const writeImageBase64ToFile = async (
      base64Str: string,
      fileName: string,
    ) => {
      const filePath = `file://${RNFS.DocumentDirectoryPath}/${fileName}`;
      RNFS.writeFile(filePath, base64Str, 'base64').then(() => {
        setCapturedImage({
          uri: filePath,
          base64: base64Str,
          fileName: fileName,
        });
      });
    };
    imageData.current &&
      writeImageBase64ToFile(
        imageData.current?.base64,
        imageData.current?.fileName,
      );
    imageData.current = undefined;
  }, [imageData]);

  return (
    <>
      <Screen
        type="fixed"
        header={<Header title="Person name" showCloseIcon={true} />}>
        <View style={styles.circle}>
          {capturedImage.uri ? (
            <Image
              source={{uri: capturedImage?.uri}}
              style={styles.capturedImage}
            />
          ) : (
            <Image source={theme.icon.add_image} style={styles.user} />
          )}
        </View>
        <Button
          title={capturedImage.fileName ? 'Capture again' : 'Capture'}
          onPress={onCapture}
        />
        <Button
          title="Submit"
          mode="secondary"
          onPress={onSubmit}
          disabled={!capturedImage.fileName}
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
