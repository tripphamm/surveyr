import React, { useEffect, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { useMappedState } from 'redux-react-hook';
import { Link } from 'react-router-dom';
import firebaseui from 'firebaseui';

import { auth, getUIConfig } from '../services/firebaseService';
import Shell from '../components/Shell';
import { State } from '../state/state';
import EmojiIcon from '../components/EmojiIcon';
import useRouter from '../hooks/useRouter';
import { getJoinSurveyPath } from '../utils/routeUtil';

const mapState = (state: State) => {
  return {
    user: state.user.value,
  };
};

export default function Auth() {
  const { user } = useMappedState(mapState);
  const { history } = useRouter();

  // if the user is already logged in with an anonymous account,
  // log them out so that they can log in properly
  if (user && user.isAnonymous) {
    auth.signOut();
  }

  const ui = useMemo(() => new firebaseui.auth.AuthUI(auth), []);

  useEffect(() => {
    ui.start('#firebaseui-auth-container', getUIConfig());
  }, [ui]);

  if (ui.isPendingRedirect()) {
    // if this is just the flash of UI before the auth redirect, we want to show the loading screen
    // but firebaseui needs its div to exist on the page
    // so we re-create the loading screen here, but with an invisible firebaseui div
    return (
      <Shell>
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <EmojiIcon emojiShortName=":bar_chart:" size={64} />
          <div style={{ display: 'none' }} id="firebaseui-auth-container" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
    >
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
        <Typography style={{ textAlign: 'center' }} variant="display1" gutterBottom>
          Sign in to create your own surveys!
        </Typography>

        <Typography style={{ textAlign: 'center' }} color="textSecondary">
          Hold up. I just want to{' '}
          <Link to={getJoinSurveyPath()}>
            <Typography>join a survey</Typography>
          </Link>
        </Typography>

        <div id="firebaseui-auth-container" />
      </div>
    </Shell>
  );
}
