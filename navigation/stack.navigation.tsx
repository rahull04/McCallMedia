import React from 'react';
import Login from '../screens/Login';
import Home from '../screens/Home';
import AddVoice, {AddVoiceProps} from '../screens/AddVoice';
import AddPhoto, {AddPhotoProps} from '../screens/AddPhoto';
import AddDetails, {AddDetailsProps} from '../screens/AddDetails';
import CompanyEvent from '../screens/CompanyEvent';
import QRScanner from '../screens/QRScanner';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  NoNetwork: undefined;
  AddVoice: AddVoiceProps;
  AddPhoto: AddPhotoProps;
  AddDetails: AddDetailsProps;
  CompanyEvent: undefined;
  QRScanner: undefined;
};

export const getAuthenticatedScreenStack = (AppStack: any) => (
  <>
    {/* Authenticated stack */}
    <AppStack.Screen name="Home" component={Home} />
    <AppStack.Screen
      name="AddVoice"
      screenOptions={{presentation: 'fullScreenModal'}}
      component={AddVoice}
    />
    <AppStack.Screen
      name="AddPhoto"
      screenOptions={{presentation: 'fullScreenModal'}}
      component={AddPhoto}
    />
    <AppStack.Screen
      name="AddDetails"
      screenOptions={{presentation: 'fullScreenModal'}}
      component={AddDetails}
    />
    <AppStack.Screen name="CompanyEvent" component={CompanyEvent} />
    <AppStack.Screen name="QRScanner" component={QRScanner} />
  </>
);

export const getAuthScreenStack = (AppStack: any) => (
  <>
    {/* Auth stack */}
    <AppStack.Screen name="Login" component={Login} />
  </>
);
