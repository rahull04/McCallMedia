import React, {FunctionComponent} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '../components';
import {Header} from '../components';
import {ParamListBase} from '@react-navigation/native';

export interface HomeProps {}

const Home: FunctionComponent<
  NativeStackScreenProps<ParamListBase, 'Home'>
> = () => {
  return <Screen type="fixed" header={<Header showAppName={true} />}></Screen>;
};

export default Home;
