import React from 'react';
import { Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';

import useRouter from '../hooks/useRouter';
import { State } from '../state/state';
import NotFound from '../pages/NotFound';
import { auth } from '../services/firebaseService';
import Loading from '../pages/Loading';
import ErrorMessage from '../pages/ErrorMessage';
import {
  getJoinSurveyPath,
  getSurveyInstanceRoutesPath,
  getHowItWorksPath,
} from '../utils/routeUtil';
import Join from '../pages/Join';
import SurveyInstanceRoutes from './SurveyInstanceRoutes';
import HowItWorks from '../pages/HowItWorks';

const mapState = (s: State) => {
  return {
    user: s.user.value,
    userError: s.user.errorCode,
  };
};

export default function AnonymousAuthRoutes(props: RouteComponentProps) {
  const { match } = useRouter();
  const { user } = useMappedState(mapState);

  if (user === undefined) {
    return <ErrorMessage />;
  }

  // if user is not signed in, sign them in to an anonymous account to reduce first-time use friction
  if (user === null) {
    auth.signInAnonymously();
    return <Loading />;
  }

  return (
    <Switch>
      <Route
        exact
        path={`${match.path}`}
        render={props => <Redirect {...props} to={getJoinSurveyPath()} />}
      />
      <Route path={getJoinSurveyPath()} component={Join} />
      <Route path={getHowItWorksPath()} component={HowItWorks} />
      <Route path={getSurveyInstanceRoutesPath()} component={SurveyInstanceRoutes} />

      <Route path="*" component={NotFound} />
    </Switch>
  );
}
