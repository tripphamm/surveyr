import { Action, ActionType } from './actions';

export interface Loadable<T> {
  loading: boolean;
  error?: Error | string;
  value?: T;
}

export interface State {
  userId: Loadable<string>;
}

export const initialState: State = {
  userId: { loading: true },
};

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_USER_SUCCESS:
      return {
        ...state,
        userId: { loading: false, error: undefined, value: action.userId },
      };
    case ActionType.SET_USER_FAILURE:
      return {
        ...state,
        userId: { loading: false, error: action.error, value: undefined },
      };
    case ActionType.CLEAR_SET_USER_ERROR:
      return {
        ...state,
        userId: { ...state.userId, error: undefined },
      };
    default:
      return state;
  }
};
