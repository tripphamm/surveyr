import React, { Suspense } from 'react';
import { Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';

import useRouter from '../hooks/useRouter';
import { State } from '../state/state';
import HostRoutes from './HostRoutes';
import NotFound from '../pages/NotFound';
import ErrorMessage from '../pages/ErrorMessage';
import Loading from '../pages/Loading';

const Auth = React.lazy(() => import('../pages/Auth'));

const mapState = (s: State) => {
  return {
    user: s.user.value,
    userError: s.user.errorCode,
  };
};

export default function FullAuthRoutes(props: RouteComponentProps) {
  const { match } = useRouter();
  const { user } = useMappedState(mapState);

  if (user === undefined) {
    return <ErrorMessage />;
  }

  if (user === null || user.isAnonymous) {
    return (
      <Suspense fallback={<Loading />}>
        <Auth />
      </Suspense>
    );
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
