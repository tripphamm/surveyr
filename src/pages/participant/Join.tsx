import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDispatch, useMappedState } from 'redux-react-hook';

import Shell from '../../components/Shell';
import EmojiIcon from '../../components/EmojiIcon';
import useRouter from '../../hooks/useRouter';
import { logInParticipant, joinSurvey } from '../../state/actions';
import { State } from '../../state/state';
import { surveyCodeLabelWidth } from '../../settings/magicNumbers';
import ErrorCode from '../../settings/ErrorCode';

const mapState = (s: State) => {
  return {
    surveyInstanceErrorCode: s.surveyInstance.errorCode,
  };
};

const getFriendlyErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case ErrorCode.SURVEY_INSTANCE_NOT_FOUND:
      return "Hm. We can't find that one";
    case ErrorCode.MULTIPLE_SURVEY_INSTANCES_FOUND:
    default:
      return ':( Something went wrong';
  }
};

export default function Join() {
  const urlParameters = new URLSearchParams(window.location.search);
  const code = urlParameters.get('code');

  const [surveyCode, setSurveyCode] = useState(code || '');
  const { history } = useRouter();
  const dispatch = useDispatch();
  const { surveyInstanceErrorCode } = useMappedState(mapState);
  const surveyCodeLabelRef = useRef<InputLabel | null>(null);
  const surveyCodeLabelElementRef = ReactDOM.findDOMNode(
    surveyCodeLabelRef.current,
  ) as HTMLLabelElement;

  return (
    <Shell
      iconButtonLeftIcon={<EmojiIcon emojiShortName=":bar_chart:" size={32} />}
      iconButtonLeftOnClick={() => history.push('/')}
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
        <FormControl variant="outlined" error={surveyInstanceErrorCode !== undefined}>
          <InputLabel ref={surveyCodeLabelRef} htmlFor="survey-code">
            Survey code
          </InputLabel>
          <OutlinedInput
            id="survey-code"
            value={surveyCode}
            onChange={e => setSurveyCode(e.target.value)}
            autoComplete="off"
            labelWidth={
              surveyCodeLabelElementRef !== null
                ? surveyCodeLabelElementRef.offsetWidth
                : surveyCodeLabelWidth
            }
            aria-describedby="survey-code-text"
          />
          {surveyInstanceErrorCode && (
            <FormHelperText id="survey-code-text">
              {getFriendlyErrorMessage(surveyInstanceErrorCode)}
            </FormHelperText>
          )}
        </FormControl>
        <Link to="/host">
          <Typography>{'I want to host a survey'}</Typography>
        </Link>
      </div>
    </Shell>
  );
}
