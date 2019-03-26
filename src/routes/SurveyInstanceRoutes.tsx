import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import useRouter from '../hooks/useRouter';
import useSurveyInstance from '../hooks/useSurveyInstance';
import useSurvey from '../hooks/useSurvey';

import NotFound from '../pages/NotFound';
import Loading from '../pages/Loading';
import SurveyQuestion from '../pages/SurveyQuestion';
import SurveyResults from '../pages/SurveyResults';

import ErrorCode from '../settings/ErrorCode';
import { getSurveyQuestionPath, getSurveyResultsPath } from '../utils/routeUtil';

export default function SurveyInstanceRoutes() {
  const { match } = useRouter<{ shareCode: string }>();
  const { params } = match;
  const { shareCode } = params;

  const surveyInstance = useSurveyInstance(shareCode);
  const survey = useSurvey(surveyInstance.value ? surveyInstance.value.surveyId : undefined);

  if (
    surveyInstance.errorCode === ErrorCode.SURVEY_INSTANCE_NOT_FOUND ||
    survey.errorCode === ErrorCode.SURVEY_DOES_NOT_EXIST
  ) {
    return <NotFound message="Hm. We can't find that survey." />;
  }

  if (surveyInstance.errorCode === ErrorCode.MULTIPLE_SURVEY_INSTANCES_FOUND) {
    // todo: provide better error to user
    throw new Error('Found multiple survey instances with the same code');
  }

  if (surveyInstance.loading || survey.loading) {
    return <Loading />;
  }

  if (surveyInstance.errorCode !== undefined) {
    throw new Error(`surveyInstance error: ${surveyInstance.errorCode}`);
  }

  if (survey.errorCode !== undefined) {
    throw new Error(`survey error: ${survey.errorCode}`);
  }

  if (surveyInstance.value === undefined) {
    // todo: log error
    throw new Error('surveyInstance is not loading and has no error, but value is undefined');
  }

  if (survey.value === undefined) {
    // todo: log error
    throw new Error('survey is not loading and has no error, but value is undefined');
  }

  return (
    <Switch>
      <Route
        exact
        path={`${match.path}`}
        render={props => <Redirect {...props} to={getSurveyQuestionPath(':shareCode')} />}
      />
      <Route
        path={getSurveyQuestionPath(':shareCode')}
        render={props => (
          <SurveyQuestion
            {...props}
            surveyInstance={surveyInstance.value!}
            survey={survey.value!}
          />
        )}
      />
      <Route
        path={getSurveyResultsPath(':shareCode')}
        render={props => (
          <SurveyResults {...props} surveyInstance={surveyInstance.value!} survey={survey.value!} />
        )}
      />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
