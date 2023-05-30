import React, {FunctionComponent} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {EventListItem, Header, Screen} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
export interface LoginProps {}

const Home: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = () => {
  return (
    <Screen type="fixed" header={<Header showAppName={true} />}>
      <EventListItem eventName="Event 1" />
      <EventListItem eventName="Event 2" />
    </Screen>
  );
};

export default Home;
