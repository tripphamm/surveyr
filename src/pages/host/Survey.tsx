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
import { hostSurvey } from '../../state/actions';

const mapState = (state: State) => {
  return {
    mySurveys: state.mySurveys.value,
    hostedSurvey: state.hostedSurvey.value,
  };
};

export default function Survey() {
  const dispatch = useDispatch();

  const { history, match } = useRouter<{ surveyId: string }>();
  const { params } = match;
  const { surveyId } = params;

  const { mySurveys, hostedSurvey } = useMappedState(mapState);

  if (hostedSurvey !== undefined) {
    return <Redirect to="/host/presentation" />;
  }

  if (mySurveys === undefined) {
    return <Redirect to="/host/surveys" />;
  }

  const survey = mySurveys[surveyId];

  if (survey === undefined) {
    return <NotFound />;
  }

  return (
    <Shell
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
        <Button
          style={{ height: '100%', width: '100%' }}
          variant="contained"
          color="primary"
          onClick={async () => {
            await dispatch(hostSurvey(surveyId));
          }}
        >
          Start
        </Button>
      }
    >
      <Typography variant="display1" gutterBottom>
        {survey.title}
      </Typography>
      {Object.values(survey.questions).map((question, qIndex) => (
        <Card key={`question-${qIndex}`} style={{ marginBottom: 15 }}>
          <CardHeader title={question.value} />
          <CardContent>
            <List>
              {Object.values(question.possibleAnswers).map((answer, aIndex) => (
                <ListItem key={`answer-${qIndex}-${aIndex}`}>
                  <ListItemText primary={answer.value} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Shell>
  );
}
