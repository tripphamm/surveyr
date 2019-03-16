import React, { useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';

import useRouter from './hooks/useRouter';
import { State } from './state/state';
import Join from './pages/Join';
import SurveyQuestion from './pages/SurveyQuestion';

export default function Routes() {
  const mapState = useCallback((s: State) => {
    return {
      userId: s.userId.value,
      userIdError: s.userId.errorCode,
      surveyInstance: s.surveyInstance.value,
      surveyInstanceError: s.surveyInstance.errorCode,
    };
  }, []);

  useRouter();

  const { userId, surveyInstance } = useMappedState(mapState);

  if (surveyInstance) {
    return (
      <Switch>
        <Route path="*" component={SurveyQuestion} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route exact path="*" component={Join} />
    </Switch>
  );
}
