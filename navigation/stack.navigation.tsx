import React from 'react';
import Login from '../screens/Login';
import Home from '../screens/Home';
import AddVoice, {AddVoiceProps} from '../screens/AddVoice';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  NoNetwork: undefined;
  AddVoice: AddVoiceProps;
};

export const getAuthenticatedScreenStack = (AppStack: any) => (
  <>
    {/* Authenticated stack */}
    <AppStack.Screen name="Home" component={Home} />
    <AppStack.Screen name="AddVoice" component={AddVoice} />
  </>
);

export const getAuthScreenStack = (AppStack: any) => (
  <>
    {/* Auth stack */}
    <AppStack.Screen name="Login" component={Login} />
  </>
);
