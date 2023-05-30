import React from 'react';
import Login from '../screens/Login';
import Home from '../screens/Home';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  NoNetwork: undefined;
};

export const getAuthenticatedScreenStack = (AppStack: any) => (
  <>
    {/* Authenticated stack */}
    <AppStack.Screen name="Home" component={Home} />
  </>
);

export const getAuthScreenStack = (AppStack: any) => (
  <>
    {/* Auth stack */}
    <AppStack.Screen name="Login" component={Login} />
  </>
);
