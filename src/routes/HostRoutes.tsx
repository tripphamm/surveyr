import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import useRouter from '../hooks/useRouter';
import useMySurveys from '../hooks/useMySurveys';

import { User } from '../state/state';

import Surveys from '../pages/Surveys';
import Survey from '../pages/Survey';
import CreateSurvey from '../pages/CreateSurvey';
import EditSurvey from '../pages/EditSurvey';
import Present from '../pages/Present';
import Loading from '../pages/Loading';
import ErrorMessage from '../pages/ErrorMessage';
import NotFound from '../pages/NotFound';
import {
  getSurveysPath,
  getCreateSurveyPath,
  getEditSurveyPath,
  getPresentSurveyPath,
  getSurveyPath,
} from '../utils/routeUtil';
import useMySurveyInstances from '../hooks/useMySurveyInstances';

export default function HostRoutes(props: { user: User }) {
  const { user } = props;

  const { match } = useRouter();

  const [mySurveys, saveSurvey, deleteSurvey] = useMySurveys(user.id);

  const [mySurveyInstances, updateSurveyInstance, deleteSurveyInstance] = useMySurveyInstances(
    user.id,
  );

  if (mySurveys.loading || mySurveyInstances.loading) {
    return <Loading />;
  }

  if (mySurveys.errorCode !== undefined || mySurveyInstances.errorCode) {
    return <ErrorMessage />;
  }

  // mySurveys/Instances are not loading and have no errors, so the values should be set
  if (mySurveys.value === undefined || mySurveyInstances.value === undefined) {
    // todo: log error
    return <ErrorMessage />;
  }

  return (
    <Switch>
      <Route
        exact
        path={`${match.path}`}
        render={props => <Redirect {...props} to={getSurveysPath()} />}
      />
      <Route
        path={getSurveysPath()}
        exact
        render={props => (
          <Surveys
            {...props}
            surveys={mySurveys.value!}
            surveyInstances={mySurveyInstances.value!}
          />
        )}
      />
      <Route
        path={getCreateSurveyPath()}
        exact
        render={props => <CreateSurvey {...props} saveSurvey={saveSurvey} />}
      />
      <Route
        path={getEditSurveyPath()}
        exact
        render={props => (
          <EditSurvey
            {...props}
            surveys={mySurveys.value!}
            saveSurvey={saveSurvey}
            deleteSurvey={deleteSurvey}
          />
        )}
      />
      <Route
        path={getPresentSurveyPath()}
        exact
        render={props => (
          <Present
            {...props}
            surveys={mySurveys.value!}
            surveyInstances={mySurveyInstances.value!}
            updateSurveyInstance={updateSurveyInstance}
            deleteSurveyInstance={deleteSurveyInstance}
          />
        )}
      />
      <Route
        path={getSurveyPath()}
        render={props => (
          <Survey
            {...props}
            user={user}
            surveys={mySurveys.value!}
            surveyInstances={mySurveyInstances.value!}
            deleteSurveyInstance={deleteSurveyInstance}
          />
        )}
      />

      <Route path="*" component={NotFound} />
    </Switch>
  );
}
