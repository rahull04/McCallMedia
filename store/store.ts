import {persistStore} from 'redux-persist';
import {configureStore} from '@reduxjs/toolkit';
import {persistedReducer} from './stores';

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistedStore = persistStore(store);

export {store, persistedStore};
