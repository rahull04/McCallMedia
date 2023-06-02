import React, {FC, FunctionComponent, useEffect, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  UserListItem,
  Header,
  Screen,
  Text,
  Button,
  CheckedInListItem,
} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, useTheme} from '../lib';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {TabView, SceneMap, SceneRendererProps} from 'react-native-tab-view';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

interface Route {
  key: string;
  title: string;
}
export interface CompanyEventProps {
  eventId: number;
  eventName: string;
}

interface TabBarProps {
  navigationState: {index: number; routes: Route[]};
}

const CheckedInEvents: FC = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [checkedInEvents, setCheckedInEvents] = useState<string[]>([]);

  useEffect(() => {
    var temp = [];
    for (var i = 1; i < 6; i++) {
      temp.push('Event' + i);
    }
    setCheckedInEvents(temp);
  }, []);

  return (
    <View style={styles.tabContainer}>
      <FlatList
        style={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={false}
        renderItem={({item: eventName}) => (
          <CheckedInListItem eventName={eventName} />
        )}
        data={checkedInEvents}
      />
    </View>
  );
};

const RemainingEvents: FC = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [remainingEvents, setRemainingEvents] = useState<string[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    var temp = [];
    for (var i = 1; i < 10; i++) {
      temp.push('Event' + i);
    }
    setRemainingEvents(temp);
  }, []);

  return (
    <View style={styles.tabContainer}>
      <FlatList
        style={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={false}
        renderItem={({item: eventName}) => (
          <UserListItem
            eventName={eventName}
            onEdit={() => {
              navigation.navigate('AddVoice', {});
            }}
          />
        )}
        data={remainingEvents}
        onRefresh={null}
      />
    </View>
  );
};

const CompanyEvent: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const renderScene = SceneMap({
    checkedInEvents: CheckedInEvents,
    remainingEvents: RemainingEvents,
  });

  const [routes] = React.useState([
    {key: 'checkedInEvents', title: 'Checked In'},
    {key: 'remainingEvents', title: 'Remaining'},
  ]);

  const renderTabBar = (props: SceneRendererProps & TabBarProps) => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((routeItem: Route, i: number) => {
          return (
            <View
              key={i}
              style={i === 0 ? styles.tabItemLeft : styles.tabItemRight}>
              <TouchableOpacity
                onPress={() => {
                  setTabIndex(i);
                }}>
                <Text
                  text={routeItem.title}
                  style={
                    props.navigationState.index === i
                      ? styles.activeTabTitle
                      : styles.inActiveTabTitle
                  }
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Screen
      type="fixed"
      header={<Header showAppName={true} showBackIcon={true} />}>
      <View style={styles.tabView}>
        <TabView
          navigationState={{
            index: tabIndex,
            routes,
          }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setTabIndex}
        />
      </View>
      <View style={styles.qrButton}>
        <Button
          title="Scan QR"
          onPress={() => {
            navigation.dispatch(CommonActions.navigate('QRScanner'));
          }}
        />
      </View>
    </Screen>
  );
};

export default CompanyEvent;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.color.primaryColor,
    },
    tabBarStyle: {
      backgroundColor: theme.color.primaryColor,
    },
    tabItemLeft: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.sizes[4],
    },
    tabItemRight: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.sizes[4],
    },
    activeTabTitle: {
      fontSize: theme.spacing.sizes[5],
      textAlign: 'center',
      color: theme.color.white,
      width: '100%',
      fontWeight: 'bold',
    },
    inActiveTabTitle: {
      fontSize: theme.spacing.sizes[5],
      textAlign: 'center',
      color: theme.color.white,
      width: '100%',
    },
    tabContainer: {
      flex: 1,
      marginBottom: theme.spacing.sizes[7],
    },
    flatListContent: {
      flexGrow: 0,
      backgroundColor: theme.color.white,
    },
    flatListItemContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 8,
      paddingVertical: 8,
      borderBottomColor: theme.color.black,
      borderBottomWidth: 0.5,
    },
    tabView: {
      height: '75%',
    },
    qrButton: {
      height: '15%',
    },
  });
