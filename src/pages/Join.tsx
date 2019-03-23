import React, { useState } from 'react';
import { Typography, Button, IconButton, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';

import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';
import useRouter from '../hooks/useRouter';
import { getSurveyQuestionPath } from '../utils/routeUtil';

export default function Join() {
  const urlParameters = new URLSearchParams(window.location.search);
  const code = urlParameters.get('code');

  const [shareCode, setShareCode] = useState(code || '');
  const { history } = useRouter();

  return (
    <Shell
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
      bottomBarComponent={
        <Button
          style={{ height: '100%', width: '100%' }}
          variant="contained"
          color="primary"
          disabled={shareCode.length === 0}
          onClick={() => history.push(getSurveyQuestionPath(shareCode))}
        >
          Join
        </Button>
      }
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Typography variant="display1">{'Hi.'}</Typography>
        </div>
        <TextField
          variant="outlined"
          value={shareCode}
          onChange={e => setShareCode(e.target.value)}
          autoComplete="off"
        />
        <Link to="/host">
          <Typography>{'I want to host a survey'}</Typography>
        </Link>
      </div>
    </Shell>
  );
}
