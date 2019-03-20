import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';

import useRouter from '../../hooks/useRouter';
import { State } from '../../state/state';
import Auth from '../Auth';
import Surveys from './Surveys';
import Survey from './Survey';
import CreateSurvey from './CreateSurvey';
import EditSurvey from './EditSurvey';
import Present from './Present';

const mapState = (s: State) => {
  return {
    user: s.user.value,
    userError: s.user.errorCode,
  };
};

export default function HostRoutes() {
  const { match } = useRouter();
  const { user } = useMappedState(mapState);

  if (user === undefined) {
    throw new Error('User is undefined in Host component');
  }

  if (user === null || user.isAnonymous) {
    return <Auth />;
  }

  return (
    <>
      <Route
        exact
        path={`${match.path}`}
        component={() => <Redirect to={`${match.path}/surveys`} />}
      />
      <Route exact path={`${match.path}/surveys`} component={Surveys} />
      <Route path={`${match.path}/surveys/:surveyId`} component={Survey} />
      <Route exact path={`${match.path}/surveyEditor`} component={CreateSurvey} />
      <Route path={`${match.path}/surveyEditor/:surveyId`} component={EditSurvey} />
      <Route path={`${match.path}/presentation`} component={Present} />
    </>
  );
}
