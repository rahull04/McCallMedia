import React, {FunctionComponent} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, EventListItem, Header, Screen} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {useStore} from '../lib';
import {logOutUserRequest} from '../store';
export interface LoginProps {}

const Home: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({navigation}) => {
  const {dispatchAction} = useStore();
  return (
    <Screen type="fixed" header={<Header showAppName={true} />}>
      <EventListItem eventName="Event 1" />
      <EventListItem eventName="Event 2" />
      <Button
        title="Log out"
        onPress={() => {
          dispatchAction(logOutUserRequest);
          navigation.replace('Login');
        }}
      />
    </Screen>
  );
};

export default Home;
