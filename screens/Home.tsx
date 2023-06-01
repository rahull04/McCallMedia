import React, {FunctionComponent, useEffect, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, EventListItem, Header, Screen} from '../components';
import {RootStackParamList} from '../navigation/stack.navigation';
import {GlobalThemeType, useTheme} from '../lib';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';

export interface LoginProps {}

const Home: FunctionComponent<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({navigation}) => {
  const [data, setData] = useState<string[]>([]);

  const theme = useTheme();
  const styles = makeStyles(theme);

  useEffect(() => {
    var temp = [];
    for (var i = 1; i < 4; i++) {
      temp.push('Event' + i);
    }
    setData(temp);
  }, []);

  return (
    <Screen type="fixed" header={<Header showAppName={true} />}>
      <View style={styles.container}>
        <FlatList
          style={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshing={false}
          renderItem={({item: group}) => (
            <EventListItem
              eventName="Event 1"
              onPress={() => navigation.navigate('CompanyEvent')}
            />
          )}
          data={data}
          onRefresh={null}
          contentContainerStyle={styles.contentContainerStyle}
        />
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

export default Home;

const makeStyles = (theme: GlobalThemeType) =>
  StyleSheet.create({
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
    contentContainerStyle: {
      paddingBottom: Platform.select({
        android: 100,
        ios: 200,
      }),
    },
  });
