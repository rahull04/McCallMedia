import {createSlice} from '@reduxjs/toolkit';
import {CommonState} from '../types';

const initialState: CommonState = {
  loading: false,
};

export const commonStore = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoaderRequest: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {setLoaderRequest} = commonStore.actions;
export default commonStore.reducer;
