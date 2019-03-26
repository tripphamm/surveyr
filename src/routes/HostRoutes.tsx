import React from 'react';
import { useMappedState } from 'redux-react-hook';
import { Route, Redirect, Switch } from 'react-router-dom';

import useRouter from '../hooks/useRouter';
import useMySurveys from '../hooks/useMySurveys';

import { State } from '../state/state';

import {
  getSurveysPath,
  getCreateSurveyPath,
  getEditSurveyPath,
  getSurveyPath,
  getSurveyPresenterPath,
  getSurveyPresenterInfoPath,
} from '../utils/routeUtil';
import useMySurveyInstances from '../hooks/useMySurveyInstances';
import Loading from '../pages/Loading';

const Surveys = React.lazy(() => import('../pages/Surveys'));
const Survey = React.lazy(() => import('../pages/Survey'));
const CreateSurvey = React.lazy(() => import('../pages/CreateSurvey'));
const EditSurvey = React.lazy(() => import('../pages/EditSurvey'));
const Presenter = React.lazy(() => import('../pages/Presenter'));
const PresenterInfo = React.lazy(() => import('../pages/PresenterInfo'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

const mapState = (state: State) => {
  return {
    user: state.user.value!,
  };
};

export default function HostRoutes() {
  const { user } = useMappedState(mapState);

  const { match } = useRouter();

  const [mySurveys, saveSurvey, deleteSurvey] = useMySurveys(user.id);

  const [
    mySurveyInstances,
    { addSurveyInstance, updateSurveyInstance, deleteSurveyInstance },
  ] = useMySurveyInstances(user.id);

  if (mySurveys.loading || mySurveyInstances.loading) {
    return <Loading />;
  }

  if (mySurveys.errorCode !== undefined) {
    throw new Error(`mySurveys error: ${mySurveys.errorCode}`);
  }

  if (mySurveyInstances.errorCode !== undefined) {
    throw new Error(`mySurveyInstances error: ${mySurveyInstances.errorCode}`);
  }

  // mySurveys/Instances are not loading and have no errors, so the values should be set
  if (mySurveys.value === undefined) {
    // todo: log error
    throw new Error('mySurveys is not loading and has no error, but value is undefined');
  }

  if (mySurveyInstances.value === undefined) {
    // todo: log error
    throw new Error('mySurveyInstances is not loading and has no error, but value is undefined');
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
        render={() => (
          <Surveys surveys={mySurveys.value!} surveyInstances={mySurveyInstances.value!} />
        )}
      />
      <Route
        path={getCreateSurveyPath()}
        exact
        render={() => <CreateSurvey saveSurvey={saveSurvey} />}
      />
      <Route
        path={getEditSurveyPath(':surveyId')}
        exact
        render={() => (
          <EditSurvey
            surveys={mySurveys.value!}
            saveSurvey={saveSurvey}
            deleteSurvey={deleteSurvey}
          />
        )}
      />
      <Route
        path={getSurveyPresenterPath(':shareCode')}
        exact
        render={() => (
          <Presenter
            surveys={mySurveys.value!}
            surveyInstances={mySurveyInstances.value!}
            updateSurveyInstance={updateSurveyInstance}
            deleteSurveyInstance={deleteSurveyInstance}
          />
        )}
      />
      <Route
        path={getSurveyPresenterInfoPath(':shareCode')}
        exact
        render={() => <PresenterInfo surveyInstances={mySurveyInstances.value!} />}
      />
      <Route
        path={getSurveyPath(':surveyId')}
        exact
        render={() => (
          <Survey
            surveys={mySurveys.value!}
            surveyInstances={mySurveyInstances.value!}
            addSurveyInstance={addSurveyInstance}
            deleteSurveyInstance={deleteSurveyInstance}
          />
        )}
      />

      <Route path="*" component={NotFound} />
    </Switch>
  );
}
