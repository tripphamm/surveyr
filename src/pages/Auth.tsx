import React, { useEffect } from 'react';
import { Typography, IconButton } from '@material-ui/core';
import { useMappedState } from 'redux-react-hook';
import { Link } from 'react-router-dom';

import { auth, getUIConfig, ui } from '../services/firebaseService';
import Shell from '../components/Shell';
import { State } from '../state/state';
import Loading from '../components/Loading';
import EmojiIcon from '../components/EmojiIcon';
import useRouter from '../hooks/useRouter';

interface AuthProps {
  returnURL?: string;
}

const mapState = (state: State) => {
  return {
    user: state.user.value,
  };
};

export default function Auth(props: AuthProps) {
  const { returnURL = '/' } = props;

  const { user } = useMappedState(mapState);
  const { history } = useRouter();

  if (user && user.isAnonymous) {
    auth.signOut();
  }

  useEffect(() => {
    ui.start('#firebaseui-auth-container', getUIConfig({ returnURL }));
  }, [returnURL]);

  const isPendingRedirect = ui.isPendingRedirect();

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
          justifyContent: isPendingRedirect ? 'center' : 'space-evenly',
          alignItems: 'center',
        }}
      >
        {isPendingRedirect ? (
          <EmojiIcon emojiShortName=":bar_chart:" size={64} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Typography variant="display1" style={{ marginBottom: 20 }}>
              Sign in to create your own surveys!
            </Typography>
            <Typography>
              If you're just here to take a survey <Link to="/">head to this page</Link>
            </Typography>
          </div>
        )}

        <div id="firebaseui-auth-container" />
      </div>
    </Shell>
  );
}
