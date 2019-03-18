import { Dispatch } from 'redux';
import { auth, firestore } from '../services/firebaseService';
import { SurveyInstance, Survey, Question, Answer, State, User } from './state';
import ErrorCode from '../settings/ErrorCode';

export enum ActionType {
  SET_USER_SUCCESS = 'SET_USER_SUCCESS',
  SET_USER_FAILURE = 'SET_USER_FAILURE',
  CLEAR_SET_USER_ERROR = 'CLEAR_SET_USER_ERROR',

  SET_SURVEY_INSTANCE_SUCCESS = 'SET_SURVEY_INSTANCE_SUCCESS',
  SET_SURVEY_INSTANCE_FAILURE = 'SET_SURVEY_INSTANCE_FAILURE',
  CLEAR_SET_SURVEY_INSTANCE_ERROR = 'CLEAR_SET_SURVEY_INSTANCE_ERROR',

  LEAVE_SURVEY = 'LEAVE_SURVEY',

  SET_SURVEY_SUCCESS = 'SET_SURVEY_SUCCESS',
  SET_SURVEY_FAILURE = 'SET_SURVEY_FAILURE',
  CLEAR_SET_SURVEY_ERROR = 'CLEAR_SET_SURVEY_ERROR',

  SUBMIT_ANSWER_SUCCESS = 'SUBMIT_ANSWER_SUCCESS',
  SUBMIT_ANSWER_FAILURE = 'SUBMIT_ANSWER_FAILURE',
  CLEAR_SUBMIT_ANSWER_ERROR = 'CLEAR_SUBMIT_ANSWER_ERROR',
}

interface SetUserSuccessAction {
  type: ActionType.SET_USER_SUCCESS;
  user: User | null;
}

interface SetUserFailureAction {
  type: ActionType.SET_USER_FAILURE;
  error: string;
}

interface ClearSetUserErrorAction {
  type: ActionType.CLEAR_SET_USER_ERROR;
}

interface SetSurveyInstanceSuccessAction {
  type: ActionType.SET_SURVEY_INSTANCE_SUCCESS;
  surveyInstance: SurveyInstance;
}

interface SetSurveyInstanceFailureAction {
  type: ActionType.SET_SURVEY_INSTANCE_FAILURE;
  error: string;
}

interface ClearSetSurveyInstanceErrorAction {
  type: ActionType.CLEAR_SET_SURVEY_INSTANCE_ERROR;
}

interface SetSurveySuccessAction {
  type: ActionType.SET_SURVEY_SUCCESS;
  survey: Survey;
}

interface SetSurveyFailureAction {
  type: ActionType.SET_SURVEY_FAILURE;
  error: string;
}

interface ClearSetSurveyErrorAction {
  type: ActionType.CLEAR_SET_SURVEY_ERROR;
}

interface SubmitAnswerSuccessAction {
  type: ActionType.SUBMIT_ANSWER_SUCCESS;
  questionId: string;
  answerId: string;
}

interface SubmitAnswerFailureAction {
  type: ActionType.SUBMIT_ANSWER_FAILURE;
  questionId: string;
  error: string;
}

interface ClearSubmitAnswerErrorAction {
  type: ActionType.CLEAR_SUBMIT_ANSWER_ERROR;
  questionId: string;
}

interface LeaveSurveyAction {
  type: ActionType.LEAVE_SURVEY;
}

export type Action =
  | SetUserSuccessAction
  | SetUserFailureAction
  | ClearSetUserErrorAction
  | SetSurveyInstanceSuccessAction
  | SetSurveyInstanceFailureAction
  | ClearSetSurveyInstanceErrorAction
  | SetSurveySuccessAction
  | SetSurveyFailureAction
  | ClearSetSurveyErrorAction
  | LeaveSurveyAction
  | SubmitAnswerSuccessAction
  | SubmitAnswerFailureAction
  | ClearSubmitAnswerErrorAction;

export function createSetUserSuccessAction(user: User | null): SetUserSuccessAction {
  return {
    type: ActionType.SET_USER_SUCCESS,
    user,
  };
}

export function createSetUserFailureAction(error: string): SetUserFailureAction {
  return {
    type: ActionType.SET_USER_FAILURE,
    error,
  };
}

export function createClearSetUserErrorAction(): ClearSetUserErrorAction {
  return {
    type: ActionType.CLEAR_SET_USER_ERROR,
  };
}

export function createSetSurveyInstanceSuccessAction(
  surveyInstance: SurveyInstance,
): SetSurveyInstanceSuccessAction {
  return {
    type: ActionType.SET_SURVEY_INSTANCE_SUCCESS,
    surveyInstance,
  };
}

export function createSetSurveyInstanceFailureAction(
  error: string,
): SetSurveyInstanceFailureAction {
  return {
    type: ActionType.SET_SURVEY_INSTANCE_FAILURE,
    error,
  };
}

export function createClearSetSurveyInstanceErrorAction(): ClearSetSurveyInstanceErrorAction {
  return {
    type: ActionType.CLEAR_SET_SURVEY_INSTANCE_ERROR,
  };
}

export function createSetSurveySuccessAction(survey: Survey): SetSurveySuccessAction {
  return {
    type: ActionType.SET_SURVEY_SUCCESS,
    survey,
  };
}

export function createSetSurveyFailureAction(error: string): SetSurveyFailureAction {
  return {
    type: ActionType.SET_SURVEY_FAILURE,
    error,
  };
}

export function createClearSetSurveyErrorAction(): ClearSetSurveyErrorAction {
  return {
    type: ActionType.CLEAR_SET_SURVEY_ERROR,
  };
}

export function createLeaveSurveyAction(): LeaveSurveyAction {
  return {
    type: ActionType.LEAVE_SURVEY,
  };
}

export function createSubmitAnswerSuccessAction(
  questionId: string,
  answerId: string,
): SubmitAnswerSuccessAction {
  return {
    type: ActionType.SUBMIT_ANSWER_SUCCESS,
    questionId,
    answerId,
  };
}

export function createSubmitAnswerFailureAction(
  questionId: string,
  error: string,
): SubmitAnswerFailureAction {
  return {
    type: ActionType.SUBMIT_ANSWER_FAILURE,
    questionId,
    error,
  };
}

export function createClearSubmitAnswerErrorAction(
  questionId: string,
): ClearSubmitAnswerErrorAction {
  return {
    type: ActionType.CLEAR_SUBMIT_ANSWER_ERROR,
    questionId,
  };
}

// async

let unsubscribeFromSurveyInstance: (() => void) | undefined;
export function joinSurvey(code: string) {
  return (dispatch: Dispatch) => {
    try {
      // subscribe function returns unsubscribe
      unsubscribeFromSurveyInstance = firestore
        .collection('survey-instances')
        .where('shareCode', '==', code)
        .onSnapshot(surveySnapshot => {
          try {
            if (surveySnapshot.size === 0) {
              throw ErrorCode.SURVEY_INSTANCE_NOT_FOUND;
            }

            if (surveySnapshot.size > 1) {
              throw ErrorCode.MULTIPLE_SURVEY_INSTANCES_FOUND;
            }

            const surveyInstance = surveySnapshot.docs[0].data() as SurveyInstance;
            surveyInstance.id = surveySnapshot.docs[0].id;

            dispatch(createSetSurveyInstanceSuccessAction(surveyInstance));
          } catch (error) {
            dispatch(createSetSurveyInstanceFailureAction(error.toString()));
          }
        });
    } catch (error) {
      dispatch(createSetSurveyInstanceFailureAction(error.toString()));
    }
  };
}

export function leaveSurvey() {
  return (dispatch: Dispatch) => {
    if (typeof unsubscribeFromSurveyInstance === 'function') {
      unsubscribeFromSurveyInstance();
      unsubscribeFromSurveyInstance = undefined;
    }

    dispatch(createLeaveSurveyAction());
  };
}

export function getSurvey(surveyId: string) {
  return async (dispatch: Dispatch) => {
    try {
      const surveySnapshot = await firestore
        .collection('surveys')
        .doc(surveyId)
        .get();

      if (!surveySnapshot.exists) {
        throw ErrorCode.SURVEY_DOES_NOT_EXIST;
      }

      const questionsSnapshots = await surveySnapshot.ref.collection('questions').get();
      const answersSnapshotsPromises = questionsSnapshots.docs.map(questionSnapshot => {
        return questionSnapshot.ref.collection('answers').get();
      });
      const answersSnapshots = await Promise.all(answersSnapshotsPromises);

      const survey = surveySnapshot.data() as Survey;
      survey.id = surveySnapshot.id;

      // gross manual aggregation of sub-collections because Firestore won't query sub-collections
      survey.questions = questionsSnapshots.docs.reduce<{ [questionId: string]: Question }>(
        (questions, questionSnapshot, index) => {
          const question = questionSnapshot.data() as Question;
          question.id = questionSnapshot.id;

          question.possibleAnswers = answersSnapshots[index].docs.reduce<{
            [answerId: string]: Answer;
          }>((answers, answerSnapshot) => {
            answers[answerSnapshot.id] = answerSnapshot.data() as Answer;
            answers[answerSnapshot.id].id = answerSnapshot.id;
            return answers;
          }, {});

          questions[questionSnapshot.id] = question;
          return questions;
        },
        {},
      );

      dispatch(createSetSurveySuccessAction(survey));
    } catch (error) {
      dispatch(createSetSurveyFailureAction(error.toString()));
    }
  };
}

export function submitAnswer(surveyInstanceId: string, questionId: string, answerId: string) {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      const stateSnapshot = getState();
      const { user } = stateSnapshot;

      if (user.value === undefined || user.value === null) {
        throw ErrorCode.NO_USER;
      }

      await firestore
        .collection('participant-answers')
        .doc(surveyInstanceId)
        .collection('participants')
        .doc(user.value.id)
        .collection('questions')
        .doc(questionId)
        .set({
          answerId,
        });

      dispatch(createSubmitAnswerSuccessAction(questionId, answerId));
    } catch (error) {
      dispatch(createSubmitAnswerFailureAction(questionId, error.toString()));
    }
  };
}
