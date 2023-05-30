import {Platform} from 'react-native';
import RNPermissions, {
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';
import {Logger} from './logger';

const logger = new Logger({name: 'PermissionsManager'});

export interface PermissionStatusHandler {
  /**
   * Callback on permission denied/blocked
   */
  onDenied?: () => void;
  /**
   * Callback on permission denied previously, but requestable
   */
  onPreviouslyDenied?: () => void;
  /**
   * Callback on permission granted
   */
  onGranted?: () => void;
}

export const Permissions = {
  CAMERA: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  }) as string,
  PHOTO: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  }) as string,
  MICROPHONE: Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }) as string,
};

/**
 * Class to manage the native permissions - i.e. camera, location, etc
 */
export class PermissionsManager {
  /**
   * check
   * @param permission the permission you are requesting
   * @param checkHandler the callback handler for permission status
   * @description Check permission to determine if it has been granted, or we're allowed to request it
   */
  public static check(
    permission: string,
    checkHandler: PermissionStatusHandler = {},
  ): void {
    RNPermissions.check(permission as Permission)
      .then((result: PermissionStatus) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            logger.log(`Permission (${permission}) is not available`);
            checkHandler.onDenied?.();
            break;
          case RESULTS.DENIED:
            logger.log(
              `Permission (${permission}) has not been requested or is denied but requestable`,
            );
            checkHandler.onPreviouslyDenied?.();
            break;
          case RESULTS.LIMITED:
            logger.log(
              `Permission (${permission}) is limited, only some actions are possible`,
            );
            checkHandler.onGranted?.();
            break;
          case RESULTS.GRANTED:
            logger.log(`Permission (${permission}) is granted`);
            checkHandler.onGranted?.();
            break;
          case RESULTS.BLOCKED:
            logger.log(
              `Permission (${permission}) is denied and not requestable anymore`,
            );
            checkHandler.onDenied?.();
            break;
          default:
            break;
        }
      })
      .catch(err => {
        logger.error(
          'Failed to check permission status for permission:',
          permission,
        );
        logger.error(err);
        checkHandler?.onDenied?.();
      });
  }

  /**
   * checkMultiple
   * @param permissions are the array of permissions you are checking
   * @param checkHandler the callback handler for permission statuses
   * @description Check permissions to determine if they have been granted, or we're allowed to request them
   */
  public static checkMultiple(
    permissions: string[],
    checkHandler: PermissionStatusHandler = {},
  ): void {
    RNPermissions.checkMultiple(permissions as Permission[])
      .then(result => {
        logger.log(`checkMultiple() permissions: (${JSON.stringify(result)})`);
        const permissionStatuses = Object.values(result);
        const allGranted = permissionStatuses.every(
          status => status === 'granted',
        );
        allGranted ? checkHandler.onGranted?.() : checkHandler.onDenied?.();
      })
      .catch(err => {
        logger.error(
          'Failed to check permission statuses for permissions:',
          permissions,
        );
        logger.error(err);
        checkHandler?.onDenied?.();
      });
  }

  /**
   * request
   * @param permission the permission you are requesting
   * @returns Promise<PermissionStatus>
   */
  public static request(permission: string): Promise<PermissionStatus> {
    return RNPermissions.request(permission as Permission);
  }

  /**
   * request
   * @param permissions the array of permissions you are requesting
   * @returns Promise<PermissionStatuses>
   */
  public static requestMultiple(
    permissions: string[],
    requestHandler: PermissionStatusHandler = {},
  ): void {
    RNPermissions.requestMultiple(permissions as Permission[])
      .then(result => {
        logger.log(
          `requestMultiple() permissions: (${JSON.stringify(result)})`,
        );
        const permissionStatuses = Object.values(result);
        const allGranted = permissionStatuses.every(
          status => status === 'granted',
        );
        allGranted ? requestHandler.onGranted?.() : requestHandler.onDenied?.();
      })
      .catch(err => {
        logger.error(
          'Failed to request permission for permissions:',
          permissions,
        );
        logger.error(err);
        requestHandler?.onDenied?.();
      });
  }

  /**
   * determineStatus
   * @param status the permission status received from `request`
   * @returns Promise<boolean> Whether or not the permission was granted
   */
  public static determineStatus(status: PermissionStatus): Promise<boolean> {
    switch (status) {
      case RESULTS.UNAVAILABLE:
        return Promise.resolve(false);
      case RESULTS.DENIED:
        return Promise.resolve(false);
      case RESULTS.LIMITED:
        return Promise.resolve(true); // Granted
      case RESULTS.GRANTED:
        return Promise.resolve(true); // Granted
      case RESULTS.BLOCKED:
        return Promise.resolve(false);
      default:
        return Promise.resolve(false);
    }
  }

  /**
   * getPermissionStatus
   * @param permission the type of permission
   * @returns Promise<PermissionStatus>
   */
  public static async getPermissionStatus(
    permission: string,
  ): Promise<PermissionStatus> {
    const permissionStatus = await RNPermissions.check(
      permission as Permission,
    );
    return permissionStatus;
  }
}

export default PermissionsManager;
