import {PermissionsAndroid} from 'react-native';
import appJson from '../../app.json';
import {Logger} from './logger';

const logger = new Logger({name: 'Permissions'});

export const requestExternalStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: `${appJson.displayName} Storage Permission`,
        message:
          `${appJson.displayName} needs access to your storage ` +
          'so you can download the booking invoices.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      logger.log('Storage permission granted');
      return true;
    } else {
      logger.log('Storage permission denied');
      return false;
    }
  } catch (err) {
    logger.error(err);
    return false;
  }
};
