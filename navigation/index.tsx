import React, {useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  getAuthScreenStack,
  getAuthenticatedScreenStack,
} from './stack.navigation';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import Splash from '../screens/Splash';
import NoNetwork from '../screens/NoNetwork';
import {useStore} from '../lib';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <AppStack initialRoute="Splash" />
    </NavigationContainer>
  );
}

const AppStack = ({
  initialRoute = 'Splash',
}: {
  initialRoute: keyof RootStackParamList;
}) => {
  const {
    states: {
      user: {profile},
    },
  } = useStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!profile) {
      navigation.navigate('Login');
    }
    // This needs to be called only when profile changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'push',
      }}
      initialRouteName={initialRoute}>
      {getAuthenticatedScreenStack(Stack as any)}
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="NoNetwork" component={NoNetwork} />
      {getAuthScreenStack(Stack as any)}
    </Stack.Navigator>
  );
};
