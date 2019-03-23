const ROOT = '';
const AUTH = 'u';
const ANON_AUTH = 'a';
const HOST = 'host';
const SURVEYS = 'surveys';
const SURVEY_INSTANCE = 'survey';

export const getJoinPath = () => [ROOT, ANON_AUTH, 'join'].join('/');
export const getSurveyInstanceRoutesPath = () =>
  [ROOT, ANON_AUTH, SURVEY_INSTANCE, ':shareCode'].join('/');
export const getSurveyQuestionPath = (shareCode: string = ':shareCode') =>
  [ROOT, ANON_AUTH, SURVEY_INSTANCE, shareCode, 'participant'].join('/');
export const getSurveyResultsPath = (shareCode: string = ':shareCode') =>
  [ROOT, ANON_AUTH, SURVEY_INSTANCE, shareCode, 'results'].join('/');

export const getHostPath = () => [ROOT, AUTH, HOST].join('/');
export const getSurveysPath = () => [ROOT, AUTH, HOST, SURVEYS].join('/');
export const getCreateSurveyPath = () => [ROOT, AUTH, HOST, SURVEYS, 'add'].join('/');
export const getEditSurveyPath = (surveyId: string) =>
  [ROOT, AUTH, HOST, SURVEYS, surveyId, 'edit'].join('/');
export const getPresentPath = (surveyId: string) =>
  [ROOT, AUTH, HOST, SURVEYS, surveyId, 'present'].join('/');
export const getSurveyPath = (surveyId: string) => [ROOT, AUTH, HOST, SURVEYS, surveyId].join('/');
