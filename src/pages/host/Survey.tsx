import React, { useReducer } from 'react';
import uuidv4 from 'uuid/v4';
import {
  Button,
  IconButton,
  Icon,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Redirect } from 'react-router-dom';

import Shell from '../../components/Shell';
import useRouter from '../../hooks/useRouter';
import EmojiIcon from '../../components/EmojiIcon';
import { saveSurvey } from '../../state/actions';
import { State } from '../../state/state';
import NotFound from '../NotFound';

const mapState = (state: State) => {
  return {
    mySurveys: state.mySurveys.value,
  };
};

export default function Survey() {
  const dispatch = useDispatch();

  const { history, match } = useRouter<{ surveyId: string }>();
  const { params } = match;
  const { surveyId } = params;

  const { mySurveys } = useMappedState(mapState);

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
        <IconButton color="inherit" onClick={() => history.goBack()}>
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
          onClick={async () => {}}
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
