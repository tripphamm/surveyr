import React, { useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';

import useRouter from './hooks/useRouter';
import { State } from './state/state';
import Join from './pages/participant/Join';
import SurveyQuestion from './pages/participant/SurveyQuestion';
import HostHome from './pages/host/HostHome';
import Home from './pages/Home';

export default function Routes() {
  const mapState = useCallback((s: State) => {
    return {
      userId: s.userId.value,
      userIdError: s.userId.errorCode,
      surveyInstance: s.surveyInstance.value,
    };
  }, []);

  useRouter();

  const { userId, surveyInstance } = useMappedState(mapState);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/participant" component={surveyInstance ? SurveyQuestion : Join} />
      <Route path="/host" component={HostHome} />
    </Switch>
  );
}
