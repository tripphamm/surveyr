import React, { Suspense, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useMappedState } from 'redux-react-hook';

import Home from '../pages/Home';
import TOS from '../pages/TOS';
import Privacy from '../pages/Privacy';
import NotFound from '../pages/NotFound';
import Loading from '../pages/Loading';
import { getSurveyResultsPath, getSurveyQuestionPath } from '../utils/routeUtil';
import { auth } from '../services/firebaseService';
import { createSetUserSuccessAction, createSetUserFailureAction } from '../state/actions';
import useRouter from '../hooks/useRouter';
import { State } from '../state/state';

const FullAuthRoutes = React.lazy(() => import('./FullAuthRoutes'));
const AnonymousAuthRoutes = React.lazy(() => import('./AnonymousAuthRoutes'));
const Auth = React.lazy(() => import('../pages/Auth'));

const mapState = (state: State) => {
  return {
    user: state.user.value,
  };
};

export default function Routes() {
  const dispatch = useDispatch();
  const { user } = useMappedState(mapState);
  const { history } = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      try {
        if (user === null) {
          // user signed out
          dispatch(createSetUserSuccessAction(null));
          // todo: this is imperative and bad; create an UnknonwAuthRoutes to handle this
          history.push('/auth');
        } else {
          // user signed in
          dispatch(
            createSetUserSuccessAction({
              id: user.uid,
              isAnonymous: user.isAnonymous,
              displayName: user.displayName,
            }),
          );
          history.push('/');
        }
      } catch (error) {
        dispatch(createSetUserFailureAction(error.toString()));
      }
    });

    return unsubscribe;
  }, [dispatch, history]);

  // if user is undefined, it means that we haven't determined whether or not the user is alraedy signed in
  // show the loader rather than flashing the sign-in screen
  if (user === undefined) {
    return <Loading />;
  }

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/auth"
        render={props => (
          <Suspense fallback={<Loading />}>
            <Auth {...props} />
          </Suspense>
        )}
      />
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
      <Route
        path="/join/:shareCode"
        render={props => {
          const { match } = props;
          const { params } = match;
          const { shareCode } = params;

          return <Redirect to={getSurveyQuestionPath(shareCode)} />;
        }}
      />
      <Route path="/tos" component={TOS} />
      <Route path="/privacy" component={Privacy} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
