import {useEffect, useState} from 'react';
import NetInfo, {
  NetInfoState as ConnectionState,
  NetInfoStateType as ConnectionStateType,
} from '@react-native-community/netinfo';

let lastConnectionState: ConnectionState = {
  type: ConnectionStateType.unknown,
  isConnected: null,
  isInternetReachable: null,
  details: null,
};

export const useConnectionState = () => {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>(lastConnectionState);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((next: ConnectionState) => {
      setConnectionState(next);
      lastConnectionState = next;
    });
    return unsubscribe;
  }, []);

  return connectionState;
};
