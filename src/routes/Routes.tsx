import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from '../pages/Home';
import TOS from '../pages/TOS';
import Privacy from '../pages/Privacy';
import NotFound from '../pages/NotFound';
import Loading from '../pages/Loading';
import { getSurveyResultsPath } from '../utils/routeUtil';
const FullAuthRoutes = React.lazy(() => import('./FullAuthRoutes'));
const AnonymousAuthRoutes = React.lazy(() => import('./AnonymousAuthRoutes'));

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route
        path="/u"
        render={props => (
          <Suspense fallback={<Loading />}>
            <FullAuthRoutes {...props} />
          </Suspense>
        )}
      />
      <Route
        path="/a"
        render={props => (
          <Suspense fallback={<Loading />}>
            <AnonymousAuthRoutes {...props} />
          </Suspense>
        )}
      />
      <Route
        path="/results/:shareCode"
        render={props => {
          const { match } = props;
          const { params } = match;
          const { shareCode } = params;

          return <Redirect to={getSurveyResultsPath(shareCode)} />;
        }}
      />
      <Route path="/tos" component={TOS} />
      <Route path="/privacy" component={Privacy} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
