import React from 'react';
import Login from '../screens/Login';
import Home from '../screens/Home';
import AddVoice, {AddVoiceProps} from '../screens/AddVoice';
import AddPhoto, {AddPhotoProps} from '../screens/AddPhoto';
import AddDetails, {AddDetailsProps} from '../screens/AddDetails';
import CompanyEvent, {CompanyEventProps} from '../screens/CompanyEvent';
import QRScanner from '../screens/QRScanner';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  NoNetwork: undefined;
  AddVoice: AddVoiceProps;
  AddPhoto: AddPhotoProps;
  AddDetails: AddDetailsProps;
  CompanyEvent: CompanyEventProps;
  QRScanner: undefined;
};

export const getAuthenticatedScreenStack = (AppStack: any) => (
  <>
    {/* Authenticated stack */}
    <AppStack.Screen name="Home" component={Home} />
    <AppStack.Group screenOptions={{presentation: 'modal'}}>
      <AppStack.Screen name="AddVoice" component={AddVoice} />
    </AppStack.Group>
    <AppStack.Group screenOptions={{presentation: 'modal'}}>
      <AppStack.Screen name="AddPhoto" component={AddPhoto} />
    </AppStack.Group>
    <AppStack.Group screenOptions={{presentation: 'modal'}}>
      <AppStack.Screen name="AddDetails" component={AddDetails} />
    </AppStack.Group>
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
