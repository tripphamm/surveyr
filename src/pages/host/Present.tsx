import React from 'react';
import {
  Button,
  IconButton,
  Icon,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Redirect } from 'react-router-dom';

import Shell from '../../components/Shell';
import useRouter from '../../hooks/useRouter';
import EmojiIcon from '../../components/EmojiIcon';
import { State } from '../../state/state';
import NotFound from '../NotFound';

const mapState = (state: State) => {
  return {
    hostedSurvey: state.hostedSurvey.value,
    mySurveys: state.mySurveys.value,
  };
};

export default function Survey() {
  const dispatch = useDispatch();

  const { history } = useRouter();

  const { hostedSurvey, mySurveys } = useMappedState(mapState);

  if (hostedSurvey === undefined || mySurveys === undefined) {
    return <Redirect to="/host/surveys" />;
  }

  const survey = mySurveys[hostedSurvey.surveyId];

  if (survey === undefined) {
    return <NotFound />;
  }

  const currentQuestion = survey.questions[hostedSurvey.currentQuestionId];

  return (
    <Shell
      title={`Srvy | ${hostedSurvey.shareCode}`}
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
      buttonRightComponent={
        <IconButton color="inherit" onClick={() => history.push('/host/surveys')}>
          <Icon>
            <Clear />
          </Icon>
        </IconButton>
      }
      bottomBarComponent={
        <div style={{ height: '100%' }}>
          <Button
            style={{ height: 'inherit', width: '25%' }}
            variant="contained"
            color="primary"
            onClick={async () => {}}
          >
            Back
          </Button>
          <Button
            style={{ height: 'inherit', width: '25%' }}
            variant="contained"
            color="primary"
            onClick={async () => {}}
          >
            Collect
          </Button>
          <Button
            style={{ height: 'inherit', width: '25%' }}
            variant="contained"
            color="primary"
            onClick={async () => {}}
          >
            Results
          </Button>
          <Button
            style={{ height: 'inherit', width: '25%' }}
            variant="contained"
            color="primary"
            onClick={async () => {}}
          >
            Next
          </Button>
        </div>
      }
    >
      <Typography variant="display2" gutterBottom>
        srvy.live/{hostedSurvey.shareCode}
      </Typography>
      <Typography variant="display1" gutterBottom>
        {currentQuestion.value}
      </Typography>
    </Shell>
  );
}
