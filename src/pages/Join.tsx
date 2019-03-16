import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDispatch, useMappedState } from 'redux-react-hook';

import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';
import useRouter from '../hooks/useRouter';
import { logInParticipant, joinSurvey } from '../state/actions';
import { State } from '../state/state';

const mapState = (s: State) => {
  return {
    surveyInstanceError: s.surveyInstance.errorCode,
  };
};

export default function Join() {
  const [surveyCode, setSurveyCode] = useState('');
  const { history } = useRouter();
  const dispatch = useDispatch();
  const { surveyInstanceError } = useMappedState(mapState);

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
          onClick={async () => {
            await dispatch(logInParticipant());
            await dispatch(joinSurvey(surveyCode));
          }}
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
        <FormControl error={surveyInstanceError !== undefined}>
          <InputLabel htmlFor="survey-code">Survey code</InputLabel>
          <Input
            id="survey-code"
            value={surveyCode}
            onChange={e => setSurveyCode(e.target.value)}
            aria-describedby="survey-code-text"
          />
          {surveyInstanceError && (
            <FormHelperText id="survey-code-text">{surveyInstanceError}</FormHelperText>
          )}
        </FormControl>
        <Link to="/host">
          <Typography>{'I want to host a survey'}</Typography>
        </Link>
      </div>
    </Shell>
  );
}
