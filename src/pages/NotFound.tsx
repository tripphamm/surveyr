import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Typography } from '@material-ui/core';

import useRouter from '../hooks/useRouter';
import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';

export default function NotFound() {
  const { history } = useRouter();

  return (
    <Shell
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
    >
      <Typography>Hm. There isn't anything here</Typography>
      <Link to="/">Head home</Link>
    </Shell>
  );
}
