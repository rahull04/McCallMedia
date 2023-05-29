import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {globalColors, globalStyles} from './assets/styles';
import AppNavigation from './navigation';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {useStore} from './lib/hooks';
import i18next from './localization/i18n';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SheetProvider} from 'react-native-actions-sheet';
import './config/actionSheets';

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
  const {states} = useStore();

  useEffect(() => {
    // Change language whenever redux state corresponding to language changes
    i18next.changeLanguage(states.common.language);
  }, [states.common.language]);

  return (
    <SheetProvider>
      <PaperProvider theme={theme}>
        <SafeAreaProvider style={globalStyles.droidSafeArea}>
          <StatusBar />
          <View style={styles.container}>
            <AppNavigation />
          </View>
        </SafeAreaProvider>
      </PaperProvider>
    </SheetProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
