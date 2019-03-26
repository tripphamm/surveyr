import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import EmojiIcon from '../components/EmojiIcon';
import Shell from '../components/Shell';

export default function ErrorMessage({
  message,
  actionComponent,
  onNavigate,
}: {
  message?: string;
  actionComponent?: React.ReactNode;
  onNavigate?: () => void;
}) {
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
        <EmojiIcon emojiShortName=":grimacing:" size={64} />
        <Typography>Well, this is embarrassing</Typography>
        <Typography>{message || 'Something broke'}</Typography>
        {actionComponent ? (
          actionComponent
        ) : (
          <Link to="/" onClick={onNavigate}>
            <Typography>Head home</Typography>
          </Link>
        )}
      </div>
    </Shell>
  );
}
