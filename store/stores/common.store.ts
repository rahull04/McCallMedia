import {createSlice} from '@reduxjs/toolkit';
import {SupportedLanguages} from '../../lib';
import {CommonState} from '../types';

const initialState: CommonState = {
  language: SupportedLanguages.ENGLISH,
};

export const commonStore = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLanguageRequest: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const {setLanguageRequest} = commonStore.actions;
export default commonStore.reducer;
