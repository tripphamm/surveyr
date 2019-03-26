import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import useRouter from '../hooks/useRouter';
import useSurveyInstance from '../hooks/useSurveyInstance';
import useSurvey from '../hooks/useSurvey';

import NotFound from '../pages/NotFound';
import ErrorMessage from '../pages/ErrorMessage';
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
    return (
      <ErrorMessage message="Uh oh. Looks like we goofed up bad. Somebody please tell the host to restart the survey." />
    );
  }

  if (surveyInstance.loading || survey.loading) {
    return <Loading />;
  }

  // some other error; render the default error component
  if (surveyInstance.errorCode !== undefined || survey.errorCode !== undefined) {
    return <ErrorMessage />;
  }

  // surveyInstance is not loading and has no error, so the data should exist at this point

  if (surveyInstance.value === undefined || survey.value === undefined) {
    // todo: log this
    return <ErrorMessage />;
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
