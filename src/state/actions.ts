import { Dispatch } from 'redux';
import uuidv4 from 'uuid/v4';

import { firestore } from '../services/firebaseService';
import { State, User } from './state';
import ErrorCode from '../settings/ErrorCode';

export enum ActionType {
  SET_USER_SUCCESS = 'SET_USER_SUCCESS',
  SET_USER_FAILURE = 'SET_USER_FAILURE',
  CLEAR_SET_USER_ERROR = 'CLEAR_SET_USER_ERROR',
}

export type Action = SetUserSuccessAction | SetUserFailureAction | ClearSetUserErrorAction;

interface SetUserSuccessAction {
  type: ActionType.SET_USER_SUCCESS;
  user: User | null;
}
export function createSetUserSuccessAction(user: User | null): SetUserSuccessAction {
  return {
    type: ActionType.SET_USER_SUCCESS,
    user,
  };
}

interface SetUserFailureAction {
  type: ActionType.SET_USER_FAILURE;
  error: string;
}
export function createSetUserFailureAction(error: string): SetUserFailureAction {
  return {
    type: ActionType.SET_USER_FAILURE,
    error,
  };
}

interface ClearSetUserErrorAction {
  type: ActionType.CLEAR_SET_USER_ERROR;
}
export function createClearSetUserErrorAction(): ClearSetUserErrorAction {
  return {
    type: ActionType.CLEAR_SET_USER_ERROR,
  };
}
