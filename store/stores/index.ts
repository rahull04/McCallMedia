import {combineReducers} from '@reduxjs/toolkit';
import userReducer from './user.store';
import commonReducer from './common.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
};

export const rootReducer = combineReducers({
  user: userReducer,
  common: commonReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export type StoreState = ReturnType<typeof rootReducer>;
export * from './common.store';
export * from './user.store';
