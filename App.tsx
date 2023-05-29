import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {globalColors, globalStyles} from './assets/styles';
import AppNavigation from './navigation';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const theme = {
  ...DefaultTheme,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: globalColors.primaryColor,
    accent: 'yellow',
    surface: globalColors.yellow2,
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider style={globalStyles.droidSafeArea}>
        <StatusBar />
        <View style={styles.container}>
          <AppNavigation />
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
