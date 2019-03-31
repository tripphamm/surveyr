import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import useRouter from '../hooks/useRouter';

import {
  getSurveysPath,
  getCreateSurveyPath,
  getEditSurveyPath,
  getSurveyPath,
  getSurveyPresenterPath,
  getSurveyPresenterInfoPath,
} from '../utils/routeUtil';
import useSurveyInstanceActions from '../hooks/useSurveyInstanceActions';
import useSurveyActions from '../hooks/useSurveyActions';
import useSession from '../hooks/useSession';
import Loading from '../pages/Loading';

const Surveys = React.lazy(() => import('../pages/Surveys'));
const Survey = React.lazy(() => import('../pages/Survey'));
const CreateSurvey = React.lazy(() => import('../pages/CreateSurvey'));
const EditSurvey = React.lazy(() => import('../pages/EditSurvey'));
const Presenter = React.lazy(() => import('../pages/Presenter'));
const PresenterInfo = React.lazy(() => import('../pages/PresenterInfo'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

export default function HostRoutes() {
  const { ready, user, surveys: mySurveys, surveyInstances: mySurveyInstances } = useSession();

  if (user === null || user === undefined) {
    throw new Error('Missing user in HostRoutes');
  }

  const { match } = useRouter();

  const { addSurvey, updateSurvey, deleteSurvey } = useSurveyActions(user.id);

  const {
    addSurveyInstance,
    updateSurveyInstance,
    deleteSurveyInstance,
  } = useSurveyInstanceActions(user.id);

  if (!ready) {
    return <Loading />;
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
        render={() => <Surveys surveys={mySurveys!} surveyInstances={mySurveyInstances!} />}
      />
      <Route
        path={getCreateSurveyPath()}
        exact
        render={() => <CreateSurvey addSurvey={addSurvey} />}
      />
      <Route
        path={getEditSurveyPath(':surveyId')}
        exact
        render={() => (
          <EditSurvey
            surveys={mySurveys!}
            updateSurvey={updateSurvey}
            deleteSurvey={deleteSurvey}
          />
        )}
      />
      <Route
        path={getSurveyPresenterPath(':shareCode')}
        exact
        render={() => (
          <Presenter
            surveys={mySurveys!}
            surveyInstances={mySurveyInstances!}
            updateSurveyInstance={updateSurveyInstance}
            deleteSurveyInstance={deleteSurveyInstance}
          />
        )}
      />
      <Route
        path={getSurveyPresenterInfoPath(':shareCode')}
        exact
        render={() => <PresenterInfo surveyInstances={mySurveyInstances!} />}
      />
      <Route
        path={getSurveyPath(':surveyId')}
        exact
        render={() => (
          <Survey
            surveys={mySurveys!}
            surveyInstances={mySurveyInstances!}
            addSurveyInstance={addSurveyInstance}
            deleteSurveyInstance={deleteSurveyInstance}
          />
        )}
      />

      <Route path="*" component={NotFound} />
    </Switch>
  );
}
