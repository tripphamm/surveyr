import { Dispatch } from 'redux';
import uuidv4 from 'uuid/v4';

import { auth, firestore } from '../services/firebaseService';
import {
  SurveyInstance,
  Survey,
  Answer,
  State,
  User,
  UnsavedSurvey,
  NormalizedQuestion,
  NormalizedSurvey,
  Loadable,
  NormalizedSurveys,
  SurveyAnswersByQuestionId,
  NormalizedAnswer,
} from './state';
import ErrorCode from '../settings/ErrorCode';

export enum ActionType {
  SET_USER_SUCCESS = 'SET_USER_SUCCESS',
  SET_USER_FAILURE = 'SET_USER_FAILURE',
  CLEAR_SET_USER_ERROR = 'CLEAR_SET_USER_ERROR',

  SET_SURVEY_INSTANCE_SUCCESS = 'SET_SURVEY_INSTANCE_SUCCESS',
  SET_SURVEY_INSTANCE_FAILURE = 'SET_SURVEY_INSTANCE_FAILURE',
  CLEAR_SET_SURVEY_INSTANCE_ERROR = 'CLEAR_SET_SURVEY_INSTANCE_ERROR',

  LEAVE_SURVEY = 'LEAVE_SURVEY',

  SET_ACTIVE_SURVEY_SUCCESS = 'SET_ACTIVE_SURVEY_SUCCESS',
  SET_ACTIVE_SURVEY_FAILURE = 'SET_ACTIVE_SURVEY_FAILURE',
  CLEAR_SET_ACTIVE_SURVEY_ERROR = 'CLEAR_SET_ACTIVE_SURVEY_ERROR',

  SET_MY_SURVEYS_SUCCESS = 'SET_MY_SURVEYS_SUCCESS',
  SET_MY_SURVEYS_FAILURE = 'SET_MY_SURVEYS_FAILURE',
  CLEAR_SET_MY_SURVEYS_ERROR = 'CLEAR_SET_MY_SURVEYS_ERROR',

  SUBMIT_ANSWER_SUCCESS = 'SUBMIT_ANSWER_SUCCESS',
  SUBMIT_ANSWER_FAILURE = 'SUBMIT_ANSWER_FAILURE',
  CLEAR_SUBMIT_ANSWER_ERROR = 'CLEAR_SUBMIT_ANSWER_ERROR',

  SET_HOSTED_SURVEY_SUCCESS = 'SET_HOSTED_SURVEY_SUCCESS',
  SET_HOSTED_SURVEY_FAILURE = 'SET_HOSTED_SURVEY_FAILURE',
  CLEAR_SET_HOSTED_SURVEY_ERROR = 'CLEAR_SET_HOSTED_SURVEY_ERROR',

  SET_SURVEY_ANSWERS_SUCCESS = 'SET_SURVEY_ANSWERS_SUCCESS',
  SET_SURVEY_ANSWERS_FAILURE = 'SET_SURVEY_ANSWERS_FAILURE',
  CLEAR_SET_SURVEY_ANSWERS_ERROR = 'CLEAR_SET_SURVEY_ANSWERS_ERROR',

  SAVE_SURVEY_FAILURE = 'SAVE_SURVEY_FAILURE',
  CLEAR_SAVE_SURVEY_ERROR = 'CLEAR_SAVE_SURVEY_ERROR',

  CLEAR_MY_SURVEYS = 'CLEAR_MY_SURVEYS',
  STOP_HOSTING_SURVEY = 'STOP_HOSTING_SURVEY',
}

export type Action =
  | SetUserSuccessAction
  | SetUserFailureAction
  | ClearSetUserErrorAction
  | SetSurveyInstanceSuccessAction
  | SetSurveyInstanceFailureAction
  | ClearSetSurveyInstanceErrorAction
  | SetActiveSurveySuccessAction
  | SetActiveSurveyFailureAction
  | ClearSetActiveSurveyErrorAction
  | LeaveSurveyAction
  | SubmitAnswerSuccessAction
  | SubmitAnswerFailureAction
  | ClearSubmitAnswerErrorAction
  | SaveSurveyFailureAction
  | ClearSaveSurveyErrorAction
  | SetMySurveysSuccessAction
  | SetMySurveysFailureAction
  | ClearSetMySurveysErrorAction
  | SetHostedSurveySuccessAction
  | SetHostedSurveyFailureAction
  | ClearSetHostedSurveyErrorAction
  | SetSurveyAnswersSuccessAction
  | SetSurveyAnswersFailureAction
  | ClearSetSurveyAnswersErrorAction
  | ClearMySurveysAction
  | StopHostingSurveyAction;

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

interface SetSurveyInstanceSuccessAction {
  type: ActionType.SET_SURVEY_INSTANCE_SUCCESS;
  surveyInstance: SurveyInstance;
}
export function createSetSurveyInstanceSuccessAction(
  surveyInstance: SurveyInstance,
): SetSurveyInstanceSuccessAction {
  return {
    type: ActionType.SET_SURVEY_INSTANCE_SUCCESS,
    surveyInstance,
  };
}

interface SetSurveyInstanceFailureAction {
  type: ActionType.SET_SURVEY_INSTANCE_FAILURE;
  error: string;
}
export function createSetSurveyInstanceFailureAction(
  error: string,
): SetSurveyInstanceFailureAction {
  return {
    type: ActionType.SET_SURVEY_INSTANCE_FAILURE,
    error,
  };
}

interface ClearSetSurveyInstanceErrorAction {
  type: ActionType.CLEAR_SET_SURVEY_INSTANCE_ERROR;
}
export function createClearSetSurveyInstanceErrorAction(): ClearSetSurveyInstanceErrorAction {
  return {
    type: ActionType.CLEAR_SET_SURVEY_INSTANCE_ERROR,
  };
}

interface SetActiveSurveySuccessAction {
  type: ActionType.SET_ACTIVE_SURVEY_SUCCESS;
  activeSurvey: NormalizedSurvey;
}
export function createSetActiveSurveySuccessAction(
  activeSurvey: NormalizedSurvey,
): SetActiveSurveySuccessAction {
  return {
    type: ActionType.SET_ACTIVE_SURVEY_SUCCESS,
    activeSurvey,
  };
}

interface SetActiveSurveyFailureAction {
  type: ActionType.SET_ACTIVE_SURVEY_FAILURE;
  error: string;
}
export function createSetActiveSurveyFailureAction(error: string): SetActiveSurveyFailureAction {
  return {
    type: ActionType.SET_ACTIVE_SURVEY_FAILURE,
    error,
  };
}

interface ClearSetActiveSurveyErrorAction {
  type: ActionType.CLEAR_SET_ACTIVE_SURVEY_ERROR;
}
export function createClearSetActiveSurveyErrorAction(): ClearSetActiveSurveyErrorAction {
  return {
    type: ActionType.CLEAR_SET_ACTIVE_SURVEY_ERROR,
  };
}

interface LeaveSurveyAction {
  type: ActionType.LEAVE_SURVEY;
}
export function createLeaveSurveyAction(): LeaveSurveyAction {
  return {
    type: ActionType.LEAVE_SURVEY,
  };
}

interface SubmitAnswerSuccessAction {
  type: ActionType.SUBMIT_ANSWER_SUCCESS;
  surveyInstanceId: string;
  questionId: string;
  answerId: string;
}
export function createSubmitAnswerSuccessAction(
  surveyInstanceId: string,
  questionId: string,
  answerId: string,
): SubmitAnswerSuccessAction {
  return {
    type: ActionType.SUBMIT_ANSWER_SUCCESS,
    surveyInstanceId,
    questionId,
    answerId,
  };
}

interface SubmitAnswerFailureAction {
  type: ActionType.SUBMIT_ANSWER_FAILURE;
  surveyInstanceId: string;
  questionId: string;
  error: string;
}
export function createSubmitAnswerFailureAction(
  surveyInstanceId: string,
  questionId: string,
  error: string,
): SubmitAnswerFailureAction {
  return {
    type: ActionType.SUBMIT_ANSWER_FAILURE,
    surveyInstanceId,
    questionId,
    error,
  };
}

interface ClearSubmitAnswerErrorAction {
  type: ActionType.CLEAR_SUBMIT_ANSWER_ERROR;
  surveyInstanceId: string;
  questionId: string;
}
export function createClearSubmitAnswerErrorAction(
  surveyInstanceId: string,
  questionId: string,
): ClearSubmitAnswerErrorAction {
  return {
    type: ActionType.CLEAR_SUBMIT_ANSWER_ERROR,
    surveyInstanceId,
    questionId,
  };
}

interface SaveSurveyFailureAction {
  type: ActionType.SAVE_SURVEY_FAILURE;
  error: string;
}
export function createSaveSurveyFailureAction(error: string): SaveSurveyFailureAction {
  return {
    type: ActionType.SAVE_SURVEY_FAILURE,
    error,
  };
}

interface ClearSaveSurveyErrorAction {
  type: ActionType.CLEAR_SAVE_SURVEY_ERROR;
}
export function createClearSaveSurveyErrorAction(questionId: string): ClearSaveSurveyErrorAction {
  return {
    type: ActionType.CLEAR_SAVE_SURVEY_ERROR,
  };
}

interface SetMySurveysSuccessAction {
  type: ActionType.SET_MY_SURVEYS_SUCCESS;
  mySurveys: NormalizedSurveys;
}
export function createSetMySurveysSuccessAction(
  mySurveys: NormalizedSurveys,
): SetMySurveysSuccessAction {
  return {
    type: ActionType.SET_MY_SURVEYS_SUCCESS,
    mySurveys,
  };
}

interface SetMySurveysFailureAction {
  type: ActionType.SET_MY_SURVEYS_FAILURE;
  error: string;
}
export function createSetMySurveysFailureAction(error: string): SetMySurveysFailureAction {
  return {
    type: ActionType.SET_MY_SURVEYS_FAILURE,
    error,
  };
}

interface ClearSetMySurveysErrorAction {
  type: ActionType.CLEAR_SET_MY_SURVEYS_ERROR;
}
export function createClearSetMySurveysErrorAction(): ClearSetMySurveysErrorAction {
  return {
    type: ActionType.CLEAR_SET_MY_SURVEYS_ERROR,
  };
}

interface SetHostedSurveySuccessAction {
  type: ActionType.SET_HOSTED_SURVEY_SUCCESS;
  hostedSurvey: SurveyInstance;
}
export function createSetHostedSurveySuccessAction(
  hostedSurvey: SurveyInstance,
): SetHostedSurveySuccessAction {
  return {
    type: ActionType.SET_HOSTED_SURVEY_SUCCESS,
    hostedSurvey,
  };
}

interface SetHostedSurveyFailureAction {
  type: ActionType.SET_HOSTED_SURVEY_FAILURE;
  error: string;
}
export function createSetHostedSurveyFailureAction(error: string): SetHostedSurveyFailureAction {
  return {
    type: ActionType.SET_HOSTED_SURVEY_FAILURE,
    error,
  };
}

interface ClearSetHostedSurveyErrorAction {
  type: ActionType.CLEAR_SET_HOSTED_SURVEY_ERROR;
}
export function createClearSetHostedSurveyErrorAction(): ClearSetHostedSurveyErrorAction {
  return {
    type: ActionType.CLEAR_SET_HOSTED_SURVEY_ERROR,
  };
}

interface SetSurveyAnswersSuccessAction {
  type: ActionType.SET_SURVEY_ANSWERS_SUCCESS;
  surveyAnswers: SurveyAnswersByQuestionId;
}
export function createSetSurveyAnswersSuccessAction(
  surveyAnswers: SurveyAnswersByQuestionId,
): SetSurveyAnswersSuccessAction {
  return {
    type: ActionType.SET_SURVEY_ANSWERS_SUCCESS,
    surveyAnswers,
  };
}

interface SetSurveyAnswersFailureAction {
  type: ActionType.SET_SURVEY_ANSWERS_FAILURE;
  error: string;
}
export function createSetSurveyAnswersFailureAction(error: string): SetSurveyAnswersFailureAction {
  return {
    type: ActionType.SET_SURVEY_ANSWERS_FAILURE,
    error,
  };
}

interface ClearSetSurveyAnswersErrorAction {
  type: ActionType.CLEAR_SET_SURVEY_ANSWERS_ERROR;
}
export function createClearSetSurveyAnswersErrorAction(): ClearSetSurveyAnswersErrorAction {
  return {
    type: ActionType.CLEAR_SET_SURVEY_ANSWERS_ERROR,
  };
}

interface ClearMySurveysAction {
  type: ActionType.CLEAR_MY_SURVEYS;
}
export function createClearMySurveysAction(): ClearMySurveysAction {
  return {
    type: ActionType.CLEAR_MY_SURVEYS,
  };
}

interface StopHostingSurveyAction {
  type: ActionType.STOP_HOSTING_SURVEY;
}
export function createStopHostingSurveyAction(): StopHostingSurveyAction {
  return {
    type: ActionType.STOP_HOSTING_SURVEY,
  };
}

// async

function normalizeSurvey(survey: Survey): NormalizedSurvey {
  const normalizedQuestions = survey.questions.reduce<{
    [questionId: string]: NormalizedQuestion;
  }>((questions, question, qIndex) => {
    const normalizedAnswers = question.possibleAnswers.reduce<{
      [answerId: string]: NormalizedAnswer;
    }>((answers, answer, aIndex) => {
      answers[answer.id] = {
        ...answer,
        number: aIndex,
      };
      return answers;
    }, {});

    questions[question.id] = {
      ...question,
      number: qIndex,
      possibleAnswers: normalizedAnswers,
    };

    return questions;
  }, {});

  return {
    ...survey,
    questions: normalizedQuestions,
  };
}

let unsubscribeFromSurveyInstance: (() => void) | undefined;
export function joinSurvey(code: string) {
  return (dispatch: Dispatch) => {
    try {
      // subscribe function returns unsubscribe
      unsubscribeFromSurveyInstance = firestore
        .collection('survey-instances')
        // always uppercase code before sending because we only generate uppercase codes
        // this is a hacky "ignore-case" impelementation
        .where('shareCode', '==', code.toUpperCase())
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

      const survey = surveySnapshot.data() as Survey;
      survey.id = surveySnapshot.id;

      const normalizedSurvey = normalizeSurvey(survey);

      dispatch(createSetActiveSurveySuccessAction(normalizedSurvey));
    } catch (error) {
      dispatch(createSetActiveSurveyFailureAction(error.toString()));
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

      const existingAnswersSnapshot = await firestore
        .collection('participant-answers')
        .doc(surveyInstanceId)
        .collection('answers')
        .where('participantId', '==', user.value.id)
        .where('questionId', '==', questionId)
        .get();

      // delete any existing answers (technically, there should only be one)
      if (!existingAnswersSnapshot.empty) {
        const batch = firestore.batch();

        existingAnswersSnapshot.docs.forEach(existingAnswerDoc => {
          batch.delete(existingAnswerDoc.ref);
        });

        await batch.commit();
      }

      await firestore
        .collection('participant-answers')
        .doc(surveyInstanceId)
        .collection('answers')
        .add({
          participantId: user.value.id,
          questionId,
          answerId,
        });

      dispatch(createSubmitAnswerSuccessAction(surveyInstanceId, questionId, answerId));
    } catch (error) {
      dispatch(createSubmitAnswerFailureAction(surveyInstanceId, questionId, error.toString()));
    }
  };
}

export function saveSurvey(survey: UnsavedSurvey) {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      const stateSnapshot = getState();
      const { user } = stateSnapshot;

      if (user.value === undefined || user.value === null) {
        throw ErrorCode.NO_USER;
      }

      const ref = firestore.collection('surveys');
      if (survey.id) {
        // this is an edit
        await ref.doc(survey.id).set(survey);
      } else {
        // this is a new survey
        survey.authorId = user.value.id;
        await ref.add(survey);
      }
    } catch (error) {
      dispatch(createSaveSurveyFailureAction(error.toString()));
    }
  };
}

let unsubscribeFromMySurveys: (() => void) | undefined;
export function subscribeToMySurveys() {
  return (dispatch: Dispatch, getState: () => State) => {
    try {
      const stateSnapshot = getState();
      const { user } = stateSnapshot;

      if (user.value === undefined || user.value === null) {
        throw ErrorCode.NO_USER;
      }

      // unsubscribe from any previous subscription
      if (typeof unsubscribeFromMySurveys === 'function') {
        unsubscribeFromMySurveys();
        unsubscribeFromMySurveys = undefined;
      }

      // subscribe function returns unsubscribe
      unsubscribeFromMySurveys = firestore
        .collection('surveys')
        .where('authorId', '==', user.value.id)
        .onSnapshot(surveysSnapshot => {
          try {
            const mySurveys = surveysSnapshot.docs.reduce<NormalizedSurveys>(
              (surveys, surveyDoc) => {
                const survey = surveyDoc.data() as Survey;
                survey.id = surveyDoc.id;
                surveys[surveyDoc.id] = normalizeSurvey(survey);
                return surveys;
              },
              {},
            );

            dispatch(createSetMySurveysSuccessAction(mySurveys));
          } catch (error) {
            dispatch(createSetMySurveysFailureAction(error.toString()));
          }
        });
    } catch (error) {
      dispatch(createSetMySurveysFailureAction(error.toString()));
    }
  };
}

let unsubscribeFromHostedSurvey: (() => void) | undefined;
export function hostSurvey(surveyId: string) {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      const stateSnapshot = getState();
      const { mySurveys, user } = stateSnapshot;

      if (user.value === undefined || user.value === null) {
        throw ErrorCode.NO_USER;
      }

      if (mySurveys.value === undefined) {
        throw 'SURVEYS_NOT_LOADED';
      }

      const survey = mySurveys.value[surveyId];

      if (survey === undefined) {
        throw 'SURVEY_DOES_NOT_EXIST';
      }

      const hostedSurvey = await firestore.collection('survey-instances').add({
        authorId: user.value.id,
        surveyId: survey.id,
        // we can assume that the 'find' will come back with an element since the `number`
        // prop is coming from the index in the question array
        currentQuestionId: Object.values(survey.questions).find(q => q.number === 0)!.id,
        acceptAnswers: true,
        showResults: true,
        shareCode: uuidv4()
          .slice(0, 4)
          .toUpperCase(),
      });

      unsubscribeFromHostedSurvey = hostedSurvey.onSnapshot(snapshot => {
        const surveyInstance = snapshot.data() as SurveyInstance;
        surveyInstance.id = snapshot.id;
        dispatch(createSetHostedSurveySuccessAction(surveyInstance));
      });
    } catch (error) {
      dispatch(createSetHostedSurveyFailureAction(error.toString()));
    }
  };
}

export function stopHostingSurvey() {
  return async (dispatch: Dispatch) => {
    if (typeof unsubscribeFromHostedSurvey === 'function') {
      unsubscribeFromHostedSurvey();
    }

    dispatch(createStopHostingSurveyAction());
  };
}

export function subscribeToSurveyAnswers(surveyInstanceId: string) {
  return async (dispatch: Dispatch) => {
    try {
      firestore
        .collection('participant-answers')
        .doc(surveyInstanceId)
        .collection('answers')
        .onSnapshot(snapshot => {
          try {
            const answerDocs = snapshot.docs;

            const normalizedAnswers = answerDocs.reduce<SurveyAnswersByQuestionId>(
              (answers, answerDoc) => {
                const answerData = answerDoc.data();
                if (answers[answerData.questionId] === undefined) {
                  answers[answerData.questionId] = [];
                }

                answers[answerData.questionId].push({
                  answerId: answerData.answerId,
                  participantId: answerData.participantId,
                });

                return answers;
              },
              {},
            );

            dispatch(createSetSurveyAnswersSuccessAction(normalizedAnswers));
          } catch (error) {
            dispatch(createSetSurveyAnswersFailureAction(error.toString()));
          }
        });
    } catch (error) {
      dispatch(createSetSurveyAnswersFailureAction(error.toString()));
    }
  };
}
