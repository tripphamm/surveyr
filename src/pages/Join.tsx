import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';
import useRouter from '../hooks/useRouter';
import { getHostPath, getSurveyQuestionPath, getHowItWorksPath } from '../utils/routeUtil';

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
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <Link to={getHowItWorksPath()}>
            <Typography color="primary">{'What is Srvy.live?'}</Typography>
          </Link>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Typography variant="display1">{'Hi.'}</Typography>
        </div>
        <TextField
          variant="outlined"
          label="Survey code"
          value={shareCode}
          onChange={e => setShareCode(e.target.value)}
          autoComplete="off"
        />
        <Link to={getHostPath()}>
          <Typography color="primary">{'I want to host a survey'}</Typography>
        </Link>
      </div>
    </Shell>
  );
}
