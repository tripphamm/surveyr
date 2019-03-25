import { Action, ActionType } from './actions';

export interface Loadable<T> {
  loading: boolean;
  errorCode?: string;
  value?: T;
}

export interface Subscribable<T> {
  loading: boolean;
  errorCode?: string;
  value?: T;
}

export interface SurveyInstance {
  id: string;
  authorId: string;
  shareCode: string;
  surveyId: string;
  currentQuestionId: string;
  acceptAnswers: boolean;
  showResults: boolean;
}

export interface NormalizedSurveyInstances {
  [shareCode: string]: SurveyInstance;
}

export interface User {
  id: string;
  isAnonymous: boolean;
  displayName: string | null;
}

export interface Answer {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  value: string;
  possibleAnswers: Answer[];
}

export interface Survey {
  id: string;
  authorId: string;
  title: string;
  questions: Question[];
}

export interface UnsavedSurvey {
  id?: string;
  authorId?: string;
  title: string;
  questions: Question[];
}

export interface NormalizedAnswer {
  id: string;
  number: number;
  value: string;
}

export interface NormalizedQuestion {
  id: string;
  number: number;
  value: string;
  possibleAnswers: { [answerId: string]: NormalizedAnswer };
}

export interface NormalizedSurvey {
  id: string;
  authorId: string;
  title: string;
  questions: { [questionId: string]: NormalizedQuestion };
}

export interface MySurveyResponsesByQuestionId {
  [questionId: string]: SurveyResponse;
}

export interface SurveyResponse {
  id: string;
  userId: string;
  questionId: string;
  answerId: string;
}

export interface UnsavedSurveyResponse {
  id?: string;
  userId?: string;
  questionId: string;
  answerId: string;
}

export interface SurveyResponsesByQuestionId {
  [questionId: string]: SurveyResponse[];
}

export interface NormalizedSurveys {
  [surveyId: string]: NormalizedSurvey;
}

export interface State {
  user: Loadable<User | null>;
}

export const initialState: State = {
  user: { loading: true },
};

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_USER_SUCCESS:
      return {
        ...state,
        user: { loading: false, errorCode: undefined, value: action.user },
      };
    case ActionType.SET_USER_FAILURE:
      return {
        ...state,
        user: { loading: false, errorCode: action.error, value: undefined },
      };
    case ActionType.CLEAR_SET_USER_ERROR:
      return {
        ...state,
        user: { ...state.user, errorCode: undefined },
      };
    default:
      return state;
  }
};
