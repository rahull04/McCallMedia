import {createSlice} from '@reduxjs/toolkit';
import {UserState} from '../types';

const initialState: UserState = {
  isAuthenticated: false,
  profile: undefined,
};

export const userStore = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUserRequest: (state, action) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
    },
    logOutUserRequest: state => {
      state.profile = undefined;
      state.isAuthenticated = false;
    },
  },
});

export const {loginUserRequest, logOutUserRequest} = userStore.actions;
export default userStore.reducer;
