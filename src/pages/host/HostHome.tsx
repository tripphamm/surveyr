import React from 'react';
import { Button, IconButton, Typography, Link } from '@material-ui/core';
import { useMappedState } from 'redux-react-hook';

import Shell from '../../components/Shell';
import useRouter from '../../hooks/useRouter';
import { State } from '../../state/state';
import { auth } from '../../services/firebaseService';
import EmojiIcon from '../../components/EmojiIcon';
import Loading from '../../components/Loading';
import Auth from '../Auth';

const mapState = (s: State) => {
  return {
    user: s.user.value,
    userError: s.user.errorCode,
  };
};

export default function HostHome() {
  const { history } = useRouter();
  const { user } = useMappedState(mapState);

  if (user === undefined) {
    throw new Error('User is undefined in Host component');
  }

  if (user === null || (location.pathname.startsWith('/host') && user.isAnonymous)) {
    return <Auth returnURL="/host" />;
  }

  return (
    <Shell
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
      buttonRightComponent={
        <Button color="inherit" onClick={() => auth.signOut()}>
          Logout
        </Button>
      }
    />
  );
}
