import React, {FunctionComponent, useEffect, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, EventListItem, Header, Screen} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, useStore, useTheme} from '../lib';
import {logOutUserRequest} from '../store';
import {FlatList, StyleSheet} from 'react-native';
export interface LoginProps {}

const CompanyEvent: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({navigation}) => {
  const {dispatchAction} = useStore();
  const [data, setData] = useState<string[]>([]);

  const theme = useTheme();
  const styles = makeStyles(theme);

  useEffect(() => {
    var temp = [];
    for (var i = 1; i < 10; i++) {
      temp.push('Event' + i);
    }
    setData(temp);
  }, []);

  return (
    <Screen type="fixed" header={<Header showAppName={true} />}>
      <FlatList
        style={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={false}
        renderItem={({item: group}) => <EventListItem eventName="Event 1" />}
        data={data}
        onRefresh={null}
      />
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

export default CompanyEvent;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
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
