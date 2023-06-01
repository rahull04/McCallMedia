import React, {FC, FunctionComponent, useEffect, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UserListItem, Header, Screen, Text} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, useTheme} from '../lib';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {TabView, SceneMap, SceneRendererProps} from 'react-native-tab-view';

interface Route {
  key: string;
  title: string;
}

interface TabBarProps {
  navigationState: {index: number; routes: Route[]};
}

const CompanyEvent: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({navigation}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const styles = makeStyles(theme);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const layout = useWindowDimensions();

  const [routes] = React.useState([
    {key: 'first', title: 'Checked'},
    {key: 'second', title: 'Unchecked'},
  ]);

  const renderTabBar = (props: SceneRendererProps & TabBarProps) => {
    console.log('props.navigationState.routes', props.navigationState.routes);
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
                <Text text={routeItem.title} style={styles.screenTitle} />
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
      <TabView
        navigationState={{
          index: tabIndex,
          routes,
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}
      />
    </Screen>
  );
};

const FirstRoute: FC = () => {
  const theme = useTheme();
  const styles = makeCheckedInUsersStyles(theme);
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    var temp = [];
    for (var i = 1; i < 10; i++) {
      temp.push('Event' + i);
    }
    setData(temp);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={false}
        renderItem={({item: group}) => (
          <UserListItem
            eventName="Event 1"
            onEdit={() => {
              // navigation.navigate('AddDetails');
            }}
          />
        )}
        data={data}
        onRefresh={null}
      />
    </View>
  );
};

const SecondRoute: FC = () => {
  const theme = useTheme();
  const styles = makeCheckedInUsersStyles(theme);
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    var temp = [];
    for (var i = 1; i < 10; i++) {
      temp.push('Event' + i);
    }
    setData(temp);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={false}
        renderItem={({item: group}) => (
          <UserListItem
            eventName="Event 1"
            onEdit={() => {
              // navigation.navigate('AddDetails');
            }}
          />
        )}
        data={data}
        onRefresh={null}
      />
    </View>
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
    screenTitle: {
      fontSize: theme.spacing.sizes[5],
      textAlign: 'center',
      color: theme.color.white,
      width: '100%',
    },
  });

const makeCheckedInUsersStyles = (theme: any) => {
  return StyleSheet.create({
    container: {
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
  });
};
