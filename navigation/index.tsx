import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  RootStackParamList,
  getAuthScreenStack,
  getAuthenticatedScreenStack,
} from './stack.navigation';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screens/Splash';
import NoNetwork from '../screens/NoNetwork';

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
