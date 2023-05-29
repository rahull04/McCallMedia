import {useDispatch, useSelector} from 'react-redux';
import {AnyAction} from 'redux';
import type {StoreState} from '../../store/stores';
import {useCallback} from 'react';

export const useStore = () => {
  const states = useSelector((state: StoreState) => state);
  const dispatch = useDispatch();

  const updateState = useCallback(
    (action: (state: unknown) => AnyAction, newState: unknown) => {
      dispatch(action(newState));
    },
    [dispatch],
  );

  const dispatchAction = useCallback(
    (action: () => AnyAction) => {
      dispatch(action());
    },
    [dispatch],
  );

  return {states, updateState, dispatchAction};
};
