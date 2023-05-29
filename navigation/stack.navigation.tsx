import React from 'react';
import Login from '../screens/Login';
import {TabNav} from './tab.navigation';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  HomeTab: undefined;
  Home: undefined;
  NoNetwork: undefined;
};

export const getAuthenticatedScreenStack = (AppStack: any) => (
  <>
    {/* Authenticated stack */}
    <AppStack.Screen name="HomeTab" component={TabNav} />
  </>
);

export const getAuthScreenStack = (AppStack: any) => (
  <>
    {/* Auth stack */}
    <AppStack.Screen name="Login" component={Login} />
  </>
);
