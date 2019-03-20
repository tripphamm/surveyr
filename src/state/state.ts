import { Action, ActionType } from './actions';

export interface Loadable<T> {
  loading: boolean;
  errorCode?: string;
  value?: T;
}

export interface User {
  id: string;
  isAnonymous: boolean;
  displayName: string | null;
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

export interface Answer {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  value: string;
  possibleAnswers: Answer[];
}

export interface UnsavedSurvey {
  id?: string;
  authorId?: string;
  title: string;
  questions: Question[];
}

export interface Survey {
  id: string;
  authorId: string;
  title: string;
  questions: Question[];
}

export interface NormalizedQuestion {
  id: string;
  value: string;
  possibleAnswers: { [answerId: string]: Answer };
}

export interface NormalizedSurvey {
  id: string;
  authorId: string;
  title: string;
  questions: { [questionId: string]: NormalizedQuestion };
}

export interface NormalizedSurveys {
  [surveyId: string]: NormalizedSurvey;
}

export interface State {
  user: Loadable<User | null>;
  surveyInstance: Loadable<SurveyInstance>;
  activeSurvey: Loadable<NormalizedSurvey>;
  mySurveys: Loadable<NormalizedSurveys>;
  participantAnswers: { [questionId: string]: string };
  participantAnswerErrors: { [questionId: string]: string | null };
  hostedSurvey: Loadable<SurveyInstance>;
}

export const initialState: State = {
  user: { loading: true },
  surveyInstance: { loading: false },
  activeSurvey: { loading: false },
  mySurveys: { loading: false },
  hostedSurvey: { loading: false },
  participantAnswers: {},
  participantAnswerErrors: {},
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
    case ActionType.SET_SURVEY_INSTANCE_SUCCESS:
      return {
        ...state,
        surveyInstance: { loading: false, errorCode: undefined, value: action.surveyInstance },
      };
    case ActionType.SET_SURVEY_INSTANCE_FAILURE:
      return {
        ...state,
        surveyInstance: { loading: false, errorCode: action.error, value: undefined },
      };
    case ActionType.CLEAR_SET_SURVEY_INSTANCE_ERROR:
      return {
        ...state,
        surveyInstance: { ...state.surveyInstance, errorCode: undefined },
      };
    case ActionType.SET_ACTIVE_SURVEY_SUCCESS:
      return {
        ...state,
        activeSurvey: { loading: false, errorCode: undefined, value: action.activeSurvey },
      };
    case ActionType.SET_ACTIVE_SURVEY_FAILURE:
      return {
        ...state,
        activeSurvey: { loading: false, errorCode: action.error, value: undefined },
      };
    case ActionType.CLEAR_SET_ACTIVE_SURVEY_ERROR:
      return {
        ...state,
        activeSurvey: { ...state.activeSurvey, errorCode: undefined },
      };
    case ActionType.LEAVE_SURVEY:
      return {
        ...state,
        surveyInstance: { loading: false, errorCode: undefined, value: undefined },
        activeSurvey: { loading: false, errorCode: undefined, value: undefined },
      };
    case ActionType.SUBMIT_ANSWER_SUCCESS:
      return {
        ...state,
        participantAnswers: {
          ...state.participantAnswers,
          [action.questionId]: action.answerId,
        },
      };
    case ActionType.SUBMIT_ANSWER_FAILURE:
      return {
        ...state,
        participantAnswerErrors: {
          ...state.participantAnswerErrors,
          [action.questionId]: action.error,
        },
      };
    case ActionType.CLEAR_SUBMIT_ANSWER_ERROR:
      return {
        ...state,
        participantAnswerErrors: {
          ...state.participantAnswerErrors,
          [action.questionId]: null,
        },
      };
    case ActionType.SET_MY_SURVEYS_SUCCESS:
      return {
        ...state,
        mySurveys: { loading: false, errorCode: undefined, value: action.mySurveys },
      };
    case ActionType.SET_MY_SURVEYS_FAILURE:
      return {
        ...state,
        mySurveys: { loading: false, errorCode: action.error, value: undefined },
      };
    case ActionType.CLEAR_SET_MY_SURVEYS_ERROR:
      return {
        ...state,
        mySurveys: { ...state.mySurveys, errorCode: undefined },
      };
    case ActionType.SET_HOSTED_SURVEY_SUCCESS:
      return {
        ...state,
        hostedSurvey: { loading: false, errorCode: undefined, value: action.hostedSurvey },
      };
    case ActionType.SET_HOSTED_SURVEY_FAILURE:
      return {
        ...state,
        hostedSurvey: { loading: false, errorCode: action.error, value: undefined },
      };
    case ActionType.CLEAR_SET_HOSTED_SURVEY_ERROR:
      return {
        ...state,
        hostedSurvey: { ...state.hostedSurvey, errorCode: undefined },
      };
    case ActionType.CLEAR_MY_SURVEYS:
      return {
        ...state,
        mySurveys: { loading: false, errorCode: undefined, value: undefined },
      };

    default:
      return state;
  }
};
