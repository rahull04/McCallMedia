import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {GlobalThemeType, useTheme} from '../lib';
import {TAB_BAR_HEIGHT} from '../lib/constants';

const Tab = createBottomTabNavigator();

export const TabNav = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = makeStyles(theme, insets);

  // const getTabBarIcon = (focused: boolean, name: string) => {
  //   let imageSrc;
  //   switch (name) {
  //     case 'Home':
  //       imageSrc = focused ? theme.icon.home_active : theme.icon.home_inactive;
  //       break;
  //     case 'BookSoilTest':
  //       imageSrc = focused ? theme.icon.soil_active : theme.icon.soil_inactive;
  //       break;
  //     case 'Calculator':
  //       imageSrc = focused
  //         ? theme.icon.calculator_active
  //         : theme.icon.calculator_inactive;
  //       break;
  //     case 'Profile':
  //       imageSrc = focused
  //         ? theme.icon.profile_active
  //         : theme.icon.profile_inactive;
  //       break;
  //     default:
  //       imageSrc = focused ? theme.icon.home_active : theme.icon.home_inactive;
  //       break;
  //   }
  //   return (
  //     <Image
  //       source={imageSrc}
  //       style={focused ? styles.iconActive : styles.icon}
  //     />
  //   );
  // };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: theme.color.secondaryColor,
        tabBarInactiveTintColor: 'white',
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="HomeTab">
      {/* <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: translate('tabs.home'),
          tabBarIcon: ({focused}) => getTabBarIcon(focused, 'Home'),
        }}
        component={Home}
      />
      <Tab.Screen
        name="BookSoilTest"
        options={{
          tabBarLabel: translate('tabs.soil'),
          tabBarIcon: ({focused}) => getTabBarIcon(focused, 'BookSoilTest'),
        }}
        component={BookSoilTest}
      />
      <Tab.Screen
        name="Calculator"
        options={{
          tabBarLabel: translate('tabs.calculator'),
          tabBarIcon: ({focused}) => getTabBarIcon(focused, 'Calculator'),
        }}
        component={Calculator}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: translate('tabs.profile'),
          tabBarIcon: ({focused}) => getTabBarIcon(focused, 'Profile'),
        }}
        component={Profile}
      /> */}
    </Tab.Navigator>
  );
};

const makeStyles = (theme: GlobalThemeType, insets: EdgeInsets) =>
  StyleSheet.create({
    tabBar: {
      height: TAB_BAR_HEIGHT,
      paddingBottom: 10,
      backgroundColor: theme.color.primaryColor,
      marginBottom: Math.max(insets.bottom - 14, 0),
    },
    tabBarLabel: {
      marginTop: -8,
      paddingBottom: 0,
      fontSize: 12,
    },
    icon: {
      width: 18,
      height: 18,
    },
    iconActive: {
      width: 22,
      height: 22,
    },
  });
