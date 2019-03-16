import React, { useState } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';

import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';
import useRouter from '../hooks/useRouter';

export default function Join() {
  const [surveyCode, setSurveyCode] = useState('');
  const { history } = useRouter();

  return (
    <Shell
      iconElementLeft={<EmojiIcon emojiShortName=":bar_chart:" size={32} />}
      onLeftIconButtonClick={() => history.push('/')}
      bottomBarComponent={
        <Button
          style={{ height: '100%', width: '100%' }}
          variant="contained"
          color="primary"
          disabled={surveyCode.length === 0}
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
          <Typography variant="h3">{'Hi.'}</Typography>
        </div>
        <TextField
          variant="outlined"
          label="Survey code"
          fullWidth
          value={surveyCode}
          onChange={e => setSurveyCode(e.target.value)}
        />

        <Link to="/host">
          <Typography>{'I want to host a survey'}</Typography>
        </Link>
      </div>
    </Shell>
  );
}
