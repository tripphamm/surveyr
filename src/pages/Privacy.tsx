import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import useRouter from '../hooks/useRouter';
import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';

export default function TOS() {
  const { history } = useRouter();

  return (
    <Shell
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
    >
      <Typography>Privacy</Typography>
    </Shell>
  );
}
