import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';

import useRouter from '../hooks/useRouter';
import { State } from '../state/state';
import Auth from '../pages/Auth';
import HostRoutes from './HostRoutes';
import NotFound from '../pages/NotFound';
import ErrorMessage from '../pages/ErrorMessage';

const mapState = (s: State) => {
  return {
    user: s.user.value,
    userError: s.user.errorCode,
  };
};

export default function FullAuthRoutes() {
  const { match } = useRouter();
  const { user } = useMappedState(mapState);

  if (user === undefined) {
    return <ErrorMessage />;
  }

  if (user === null || user.isAnonymous) {
    return <Auth />;
  }

  return (
    <Switch>
      <Route
        exact
        path={`${match.path}`}
        // redirect /host to /host
        render={props => <Redirect {...props} to={`${match.path}/host`} />}
      />
      <Route path={`${match.path}/host`} render={props => <HostRoutes {...props} user={user} />} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
