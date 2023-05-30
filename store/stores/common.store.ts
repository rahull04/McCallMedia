import {createSlice} from '@reduxjs/toolkit';
import {CommonState} from '../types';

const initialState: CommonState = {
  loading: false,
};

export const commonStore = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLanguageRequest: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {setLanguageRequest} = commonStore.actions;
export default commonStore.reducer;
