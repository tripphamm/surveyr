import React, { useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';

import useRouter from './hooks/useRouter';
import { State } from './state/state';
import Join from './pages/participant/Join';
import SurveyQuestion from './pages/participant/SurveyQuestion';
import HostHome from './pages/host/HostHome';
import Home from './pages/Home';
import Auth from './pages/Auth';
import TOS from './pages/TOS';
import Privacy from './pages/Privacy';

const mapState = (s: State) => {
  return {
    user: s.user.value,
    userError: s.user.errorCode,
    surveyInstance: s.surveyInstance.value,
  };
};

export default function Routes() {
  useRouter();

  const { user, surveyInstance } = useMappedState(mapState);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/participant" component={surveyInstance ? SurveyQuestion : Join} />
      <Route path="/host" component={HostHome} />
      <Route path="/tos" component={TOS} />
      <Route path="/privacy" component={Privacy} />
    </Switch>
  );
}
