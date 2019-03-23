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
import { Add, Delete, Clear } from '@material-ui/icons';

import useRouter from '../hooks/useRouter';
import { UnsavedSurvey, Question, Answer } from '../state/state';
import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';
import { getSurveysPath } from '../utils/routeUtil';

const reduce = (state: UnsavedSurvey, action: { type: string; payload?: any }) => {
  // deep-clone the questions so that we can use destructive methods when updating the state
  // without mutating the in-use state
  const clonedQuestions = state.questions.reduce<Question[]>((questionsClone, question) => {
    const clonedAnswers = question.possibleAnswers.reduce<Answer[]>((answersClone, answer) => {
      answersClone.push({ ...answer });
      return answersClone;
    }, []);

    questionsClone.push({
      ...question,
      possibleAnswers: clonedAnswers,
    });

    return questionsClone;
  }, []);

  switch (action.type) {
    case 'SET_TITLE':
      return {
        ...state,
        title: action.payload,
      };
    case 'SET_QUESTION':
      clonedQuestions[action.payload.questionIndex].value = action.payload.value;
      return {
        ...state,
        questions: clonedQuestions,
      };
    case 'SET_ANSWER':
      clonedQuestions[action.payload.questionIndex].possibleAnswers[
        action.payload.answerIndex
      ].value = action.payload.value;
      return {
        ...state,
        questions: clonedQuestions,
      };
    case 'ADD_ANSWER':
      clonedQuestions[action.payload.questionIndex].possibleAnswers.push({
        id: uuidv4(),
        value: '',
      });
      return {
        ...state,
        questions: clonedQuestions,
      };
    case 'ADD_QUESTION':
      clonedQuestions.push({
        id: uuidv4(),
        value: '',
        possibleAnswers: [{ id: uuidv4(), value: '' }],
      });
      return {
        ...state,
        questions: clonedQuestions,
      };
    case 'REMOVE_ANSWER':
      clonedQuestions[action.payload.questionIndex].possibleAnswers.splice(
        action.payload.answerIndex,
        1,
      );
      return {
        ...state,
        questions: clonedQuestions,
      };
    case 'REMOVE_QUESTION':
      clonedQuestions.splice(action.payload.questionIndex, 1);
      return {
        ...state,
        questions: clonedQuestions,
      };
    default:
      return state;
  }
};

export default function SurveyEditor(props: {
  initialSurveyData: UnsavedSurvey;
  saveSurvey: (unsavedSurvey: UnsavedSurvey) => Promise<void>;
}) {
  const { initialSurveyData, saveSurvey } = props;

  const [unsavedSurvey, dispatchLocal] = useReducer<
    React.Reducer<UnsavedSurvey, { type: string; payload?: any }>
  >(reduce, initialSurveyData);

  const { title, questions } = unsavedSurvey;

  const { history } = useRouter();

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
          onClick={async () => {
            await saveSurvey(unsavedSurvey);
            history.push(getSurveysPath());
          }}
          disabled={
            // has a title,
            // has at least one question,
            // all questions have text and at least one answer,
            // all answers have text
            title.length === 0 ||
            questions.length === 0 ||
            questions.some(
              question =>
                question.value.length === 0 ||
                question.possibleAnswers.length === 0 ||
                question.possibleAnswers.some(answer => answer.value.length === 0),
            )
          }
        >
          Save
        </Button>
      }
    >
      <Typography variant="display1" gutterBottom>
        {"Let's make a survey"}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Survey title"
        value={title}
        style={{ marginBottom: 15 }}
        onChange={e => {
          dispatchLocal({ type: 'SET_TITLE', payload: e.target.value });
        }}
      />
      {questions.map((question, qIndex) => (
        <Card key={`question-${qIndex}`} style={{ marginBottom: 15 }}>
          <CardHeader
            action={
              <IconButton
                onClick={() =>
                  dispatchLocal({ type: 'REMOVE_QUESTION', payload: { questionIndex: qIndex } })
                }
              >
                <Delete />
              </IconButton>
            }
            disableTypography
            title={
              <TextField
                fullWidth
                variant="outlined"
                label={`Question ${qIndex + 1}`}
                value={question.value}
                onChange={e => {
                  dispatchLocal({
                    type: 'SET_QUESTION',
                    payload: { questionIndex: qIndex, value: e.target.value },
                  });
                }}
              />
            }
          />
          <CardContent>
            <List>
              {question.possibleAnswers.map((answer, aIndex) => (
                <ListItem key={`answer-${qIndex}-${aIndex}`}>
                  <ListItemText>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Answer ${aIndex + 1}`}
                      value={answer.value}
                      onChange={e => {
                        dispatchLocal({
                          type: 'SET_ANSWER',
                          payload: {
                            questionIndex: qIndex,
                            answerIndex: aIndex,
                            value: e.target.value,
                          },
                        });
                      }}
                    />
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="Delete"
                      onClick={() =>
                        dispatchLocal({
                          type: 'REMOVE_ANSWER',
                          payload: { questionIndex: qIndex, answerIndex: aIndex },
                        })
                      }
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              <IconButton
                onClick={() =>
                  dispatchLocal({ type: 'ADD_ANSWER', payload: { questionIndex: qIndex } })
                }
              >
                <Add />
              </IconButton>
            </div>
          </CardActions>
        </Card>
      ))}
      <Card>
        <CardContent>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <IconButton onClick={() => dispatchLocal({ type: 'ADD_QUESTION' })}>
              <Add />
            </IconButton>
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}
