import { Action, ActionType } from './actions';

export interface Loadable<T> {
  loading: boolean;
  errorCode?: string;
  value?: T;
}

export interface SurveyInstance {
  id: string;
  shareCode: string;
  surveyId: string;
  currentQuestionId: string;
  state: string;
}

export interface Survey {
  id: string;
  questions: {
    [questionId: string]: Question;
  };
}

export interface Question {
  id: string;
  question: string;
  possibleAnswers: {
    [answerId: string]: Answer;
  };
}

export interface Answer {
  id: string;
  answer: string;
}

export interface State {
  userId: Loadable<string>;
  surveyInstance: Loadable<SurveyInstance>;
  survey: Loadable<Survey>;
  participantAnswers: { [questionId: string]: string };
  participantAnswerErrors: { [questionId: string]: string | null };
}

export const initialState: State = {
  userId: { loading: true },
  surveyInstance: { loading: false },
  survey: { loading: false },
  participantAnswers: {},
  participantAnswerErrors: {},
};

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_USER_SUCCESS:
      return {
        ...state,
        userId: { loading: false, errorCode: undefined, value: action.userId },
      };
    case ActionType.SET_USER_FAILURE:
      return {
        ...state,
        userId: { loading: false, errorCode: action.error, value: undefined },
      };
    case ActionType.CLEAR_SET_USER_ERROR:
      return {
        ...state,
        userId: { ...state.userId, errorCode: undefined },
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
    case ActionType.SET_SURVEY_SUCCESS:
      return {
        ...state,
        survey: { loading: false, errorCode: undefined, value: action.survey },
      };
    case ActionType.SET_SURVEY_FAILURE:
      return {
        ...state,
        survey: { loading: false, errorCode: action.error, value: undefined },
      };
    case ActionType.CLEAR_SET_SURVEY_ERROR:
      return {
        ...state,
        survey: { ...state.survey, errorCode: undefined },
      };
    case ActionType.LEAVE_SURVEY:
      return {
        ...state,
        surveyInstance: { loading: false, errorCode: undefined, value: undefined },
        survey: { loading: false, errorCode: undefined, value: undefined },
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
    default:
      return state;
  }
};
