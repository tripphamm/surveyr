import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import {
  getSurveyResultsPath,
  getSurveyQuestionPath,
  getHostPath,
  getJoinSurveyPath,
  getHowItWorksPath,
  getSurveyInstanceRoutesPath,
} from '../utils/routeUtil';
import HostRoutes from './HostRoutes';
import SurveyInstanceRoutes from './SurveyInstanceRoutes';
import Loading from '../pages/Loading';
import UserGate from '../UserGate';

const Join = React.lazy(() => import('../pages/Join'));
const HowItWorks = React.lazy(() => import('../pages/HowItWorks'));
const Home = React.lazy(() => import('../pages/Home'));
const TOS = React.lazy(() => import('../pages/TOS'));
const Privacy = React.lazy(() => import('../pages/Privacy'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

export default function Routes() {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        )}
      />
      <Route
        path={getHostPath()}
        render={() => (
          <UserGate>
            <HostRoutes />
          </UserGate>
        )}
      />
      <Route
        path={getJoinSurveyPath()}
        exact
        render={() => (
          <Suspense fallback={<Loading />}>
            <Join />
          </Suspense>
        )}
      />
      <Route
        path={getHowItWorksPath()}
        render={() => (
          <Suspense fallback={<Loading />}>
            <HowItWorks />
          </Suspense>
        )}
      />
      <Route path={getSurveyInstanceRoutesPath()} component={SurveyInstanceRoutes} />
      <Route
        path="/results/:shareCode"
        exact
        render={props => {
          const { match } = props;
          const { params } = match;
          const { shareCode } = params;

          return <Redirect to={getSurveyResultsPath(shareCode)} />;
        }}
      />
      <Route
        path="/join/:shareCode"
        exact
        render={props => {
          const { match } = props;
          const { params } = match;
          const { shareCode } = params;

          return <Redirect to={getSurveyQuestionPath(shareCode)} />;
        }}
      />
      <Route
        path="/tos"
        render={() => (
          <Suspense fallback={<Loading />}>
            <TOS />
          </Suspense>
        )}
      />
      <Route
        path="/privacy"
        render={() => (
          <Suspense fallback={<Loading />}>
            <Privacy />
          </Suspense>
        )}
      />
      <Route
        path="*"
        render={() => (
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        )}
      />
    </Switch>
  );
}
