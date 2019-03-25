const ROOT = '';
const AUTH = 'u';
const ANON_AUTH = 'a';
const HOST = 'host';
const SURVEYS = 'surveys';
const SURVEY_INSTANCE = 'survey';

// anon
export const getJoinSurveyPath = () => [ROOT, ANON_AUTH, 'join'].join('/');
export const getSurveyInstanceRoutesPath = () =>
  [ROOT, ANON_AUTH, SURVEY_INSTANCE, ':shareCode'].join('/');
export const getSurveyQuestionPath = (shareCode: string = ':shareCode') =>
  [ROOT, ANON_AUTH, SURVEY_INSTANCE, shareCode, 'participant'].join('/');
export const getSurveyResultsPath = (shareCode: string = ':shareCode') =>
  [ROOT, ANON_AUTH, SURVEY_INSTANCE, shareCode, 'results'].join('/');
export const getHowItWorksPath = () => [ROOT, ANON_AUTH, 'how-it-works'].join('/');

// authd
export const getHostPath = () => [ROOT, AUTH, HOST].join('/');
export const getSurveysPath = () => [ROOT, AUTH, HOST, SURVEYS].join('/');
export const getCreateSurveyPath = () => [ROOT, AUTH, HOST, SURVEYS, 'add'].join('/');
export const getEditSurveyPath = (surveyId: string = ':surveyId') =>
  [ROOT, AUTH, HOST, SURVEYS, surveyId, 'edit'].join('/');
export const getSurveyPresenterPath = (shareCode: string = ':shareCode') =>
  [ROOT, AUTH, HOST, SURVEYS, shareCode, 'presenter'].join('/');
export const getSurveyPresenterInfoPath = (shareCode: string = ':shareCode') =>
  [ROOT, AUTH, HOST, SURVEYS, shareCode, 'presenterInfo'].join('/');
export const getSurveyPath = (surveyId: string = ':surveyId') =>
  [ROOT, AUTH, HOST, SURVEYS, surveyId].join('/');
