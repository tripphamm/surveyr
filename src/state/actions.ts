export enum ActionType {
  SET_USER_SUCCESS = 'SET_USER_SUCCESS',
  SET_USER_FAILURE = 'SET_USER_FAILURE',
  CLEAR_SET_USER_ERROR = 'CLEAR_SET_USER_ERROR',
}

export type Action = SetUserSuccessAction | SetUserFailureAction | ClearSetUserErrorAction;

interface SetUserSuccessAction {
  type: ActionType.SET_USER_SUCCESS;
  userId: string;
}

interface SetUserFailureAction {
  type: ActionType.SET_USER_FAILURE;
  error: Error | string;
}

interface ClearSetUserErrorAction {
  type: ActionType.CLEAR_SET_USER_ERROR;
}

export function createSetUserSuccessAction(userId: string): SetUserSuccessAction {
  return {
    type: ActionType.SET_USER_SUCCESS,
    userId,
  };
}

export function createSetUserFailureAction(error: Error | string): SetUserFailureAction {
  return {
    type: ActionType.SET_USER_FAILURE,
    error,
  };
}

export function clearSetUserErrorAction(): ClearSetUserErrorAction {
  return {
    type: ActionType.CLEAR_SET_USER_ERROR,
  };
}
