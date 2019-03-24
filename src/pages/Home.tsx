import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { State } from '../state/state';
import Shell from '../components/Shell';
import { getHostPath, getJoinSurveyPath } from '../utils/routeUtil';

const mapState = (state: State) => {
  return {
    user: state.user.value,
  };
};

export default function Home() {
  const { user } = useMappedState(mapState);

  // if user isn't signed in or they're signed is as anonymous
  // assume that they're just here to take a survey
  if (!user || user.isAnonymous) {
    return <Redirect to={getJoinSurveyPath()} />;
  }

  // if the user is logged in to a real account, ask if they want to host or participate
  return (
    <Shell>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <Typography variant="display1">Nice to see you again.</Typography>
        <Link style={{ textDecoration: 'none' }} to={getJoinSurveyPath()}>
          <Button variant="contained" color="primary">
            Join a survey
          </Button>
        </Link>
        <Link style={{ textDecoration: 'none' }} to={getHostPath()}>
          <Button variant="contained" color="secondary">
            Host a survey
          </Button>
        </Link>
      </div>
    </Shell>
  );
}
