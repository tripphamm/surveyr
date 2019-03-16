import React, { useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';

import useRouter from './hooks/useRouter';
import { State } from './state/state';
import HostOrParticipant from './pages/HostOrParticipant';

export default function Routes() {
  const mapState = useCallback((s: State) => {
    return {
      userId: s.userId.value,
      userIdError: s.userId.error,
    };
  }, []);

  useRouter();

  const { userId } = useMappedState(mapState);

  if (!userId) {
    return (
      <Switch>
        <Route path="*" component={HostOrParticipant} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route exact path="/" component={HostOrParticipant} />
    </Switch>
  );
}
