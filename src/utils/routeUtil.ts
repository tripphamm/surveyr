const ROOT = '';
const HOST = 'host';
const SURVEYS = 'surveys';
const SURVEY_INSTANCE = 'survey';

export const getJoinSurveyPath = () => [ROOT, 'join'].join('/');
export const getSurveyInstanceRoutesPath = () => [ROOT, SURVEY_INSTANCE, ':shareCode'].join('/');
export const getSurveyQuestionPath = (shareCode: string) =>
  [ROOT, SURVEY_INSTANCE, shareCode, 'participant'].join('/');
export const getSurveyResultsPath = (shareCode: string) =>
  [ROOT, SURVEY_INSTANCE, shareCode, 'results'].join('/');
export const getHowItWorksPath = () => [ROOT, 'how-it-works'].join('/');

// host
export const getHostPath = () => [ROOT, HOST].join('/');
export const getSurveysPath = () => [ROOT, HOST, SURVEYS].join('/');
export const getCreateSurveyPath = () => [ROOT, HOST, SURVEYS, 'add'].join('/');
export const getEditSurveyPath = (surveyId: string) =>
  [ROOT, HOST, SURVEYS, surveyId, 'edit'].join('/');
export const getSurveyPresenterPath = (shareCode: string) =>
  [ROOT, HOST, SURVEYS, shareCode, 'presenter'].join('/');
export const getSurveyPresenterInfoPath = (shareCode: string) =>
  [ROOT, HOST, SURVEYS, shareCode, 'presenterInfo'].join('/');
export const getSurveyPath = (surveyId: string) => [ROOT, HOST, SURVEYS, surveyId].join('/');
