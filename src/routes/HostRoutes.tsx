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

export default function HostRoutes(props: { user: User }) {
  const { user } = props;

  const { match } = useRouter();

  const [mySurveys, saveSurvey] = useMySurveys(user.id);

  if (mySurveys.loading) {
    return <Loading />;
  }

  if (mySurveys.errorCode !== undefined) {
    return <ErrorMessage />;
  }

  // mySurveys is not loading and has no error, so the value should exit
  if (mySurveys.value === undefined) {
    // todo: log erro
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
        render={props => <Surveys {...props} surveys={mySurveys.value!} />}
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
          <EditSurvey {...props} surveys={mySurveys.value!} saveSurvey={saveSurvey} />
        )}
      />
      <Route
        path={getPresentSurveyPath()}
        exact
        render={props => <Present {...props} surveys={mySurveys.value!} />}
      />
      <Route
        path={getSurveyPath()}
        render={props => <Survey {...props} surveys={mySurveys.value!} />}
      />

      <Route path="*" component={NotFound} />
    </Switch>
  );
}
