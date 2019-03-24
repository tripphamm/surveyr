import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import EmojiIcon from '../components/EmojiIcon';
import Shell from '../components/Shell';

export default function NotFound({
  message,
  actionComponent,
}: {
  message?: string;
  actionComponent?: React.ReactNode;
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
        <EmojiIcon emojiShortName=":thinking:" size={64} />
        <Typography>{message || "We can't find what you're looking for"}</Typography>
        {actionComponent ? (
          actionComponent
        ) : (
          <Link to="/">
            <Typography>Head home</Typography>
          </Link>
        )}
      </div>
    </Shell>
  );
}
