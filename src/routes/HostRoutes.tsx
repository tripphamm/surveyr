import React, { Suspense } from 'react';
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
const ErrorMessage = React.lazy(() => import('../pages/ErrorMessage'));
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

  if (mySurveys.errorCode !== undefined || mySurveyInstances.errorCode) {
    return (
      <Suspense fallback={<Loading />}>
        <ErrorMessage />
      </Suspense>
    );
  }

  // mySurveys/Instances are not loading and have no errors, so the values should be set
  if (mySurveys.value === undefined || mySurveyInstances.value === undefined) {
    // todo: log error
    return (
      <Suspense fallback={<Loading />}>
        <ErrorMessage />
      </Suspense>
    );
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
          <Suspense fallback={<Loading />}>
            <Surveys
              {...props}
              surveys={mySurveys.value!}
              surveyInstances={mySurveyInstances.value!}
            />
          </Suspense>
        )}
      />
      <Route
        path={getCreateSurveyPath()}
        exact
        render={() => (
          <Suspense fallback={<Loading />}>
            <CreateSurvey saveSurvey={saveSurvey} />
          </Suspense>
        )}
      />
      <Route
        path={getEditSurveyPath(':surveyId')}
        exact
        render={() => (
          <Suspense fallback={<Loading />}>
            <EditSurvey
              surveys={mySurveys.value!}
              saveSurvey={saveSurvey}
              deleteSurvey={deleteSurvey}
            />
          </Suspense>
        )}
      />
      <Route
        path={getSurveyPresenterPath(':shareCode')}
        exact
        render={() => (
          <Suspense fallback={<Loading />}>
            <Presenter
              surveys={mySurveys.value!}
              surveyInstances={mySurveyInstances.value!}
              updateSurveyInstance={updateSurveyInstance}
              deleteSurveyInstance={deleteSurveyInstance}
            />
          </Suspense>
        )}
      />
      <Route
        path={getSurveyPresenterInfoPath(':shareCode')}
        exact
        render={() => (
          <Suspense fallback={<Loading />}>
            <PresenterInfo surveyInstances={mySurveyInstances.value!} />
          </Suspense>
        )}
      />
      <Route
        path={getSurveyPath(':surveyId')}
        exact
        render={() => (
          <Suspense fallback={<Loading />}>
            <Survey
              surveys={mySurveys.value!}
              surveyInstances={mySurveyInstances.value!}
              addSurveyInstance={addSurveyInstance}
              deleteSurveyInstance={deleteSurveyInstance}
            />
          </Suspense>
        )}
      />

      <Route path="*" component={NotFound} />
    </Switch>
  );
}
