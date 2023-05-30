import React from 'react';
import Login from '../screens/Login';
import Home from '../screens/Home';
import AddVoice, {AddVoiceProps} from '../screens/AddVoice';
import AddPhoto, {AddPhotoProps} from '../screens/AddPhoto';
import AddDetails, {AddDetailsProps} from '../screens/AddDetails';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  NoNetwork: undefined;
  AddVoice: AddVoiceProps;
  AddPhoto: AddPhotoProps;
  AddDetails: AddDetailsProps;
};

export const getAuthenticatedScreenStack = (AppStack: any) => (
  <>
    {/* Authenticated stack */}
    <AppStack.Screen name="Home" component={Home} />
    <AppStack.Screen name="AddVoice" component={AddVoice} />
    <AppStack.Screen name="AddPhoto" component={AddPhoto} />
    <AppStack.Screen name="AddDetails" component={AddDetails} />
  </>
);

export const getAuthScreenStack = (AppStack: any) => (
  <>
    {/* Auth stack */}
    <AppStack.Screen name="Login" component={Login} />
  </>
);
