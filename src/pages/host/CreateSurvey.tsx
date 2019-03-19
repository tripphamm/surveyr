import React, { useReducer } from 'react';
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
import Red from '@material-ui/core/colors/red';
import { useMappedState } from 'redux-react-hook';
import { Clear, Add, MoreVert, Delete } from '@material-ui/icons';

import Shell from '../../components/Shell';
import useRouter from '../../hooks/useRouter';
import { State } from '../../state/state';
import EmojiIcon from '../../components/EmojiIcon';
import classes from '*.module.css';

const mapState = (s: State) => {
  return {};
};

interface Question {
  question: string;
  answers: {
    answer: string;
  }[];
}

interface SurveyState {
  title: string;
  questions: Question[];
}

const reduce = (state: SurveyState, action: { type: string; payload?: any }) => {
  const clonedQuestions = state.questions.reduce<Question[]>((clone, question) => {
    clone.push({
      question: question.question,
      answers: [...question.answers],
    });
    return clone;
  }, []);

  switch (action.type) {
    case 'SET_TITLE':
      return {
        ...state,
        title: action.payload,
      };
    case 'SET_QUESTION':
      clonedQuestions[action.payload.questionIndex].question = action.payload.value;
      return {
        ...state,
        questions: clonedQuestions,
      };
    case 'SET_ANSWER':
      clonedQuestions[action.payload.questionIndex].answers[action.payload.answerIndex].answer =
        action.payload.value;
      return {
        ...state,
        questions: clonedQuestions,
      };
    case 'ADD_ANSWER':
      clonedQuestions[action.payload.questionIndex].answers.push({ answer: 'sample answer' });
      return {
        ...state,
        questions: clonedQuestions,
      };
    case 'ADD_QUESTION':
      clonedQuestions.push({ question: 'Another question?', answers: [{ answer: 'answer' }] });
      return {
        ...state,
        questions: clonedQuestions,
      };
    case 'REMOVE_ANSWER':
      clonedQuestions[action.payload.questionIndex].answers.splice(action.payload.answerIndex, 1);
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
export default function CreateSurvey() {
  const [state, dispatch] = useReducer<React.Reducer<SurveyState, { type: string; payload?: any }>>(
    reduce,
    {
      title: '',
      questions: [{ question: 'Is this a sample question?', answers: [{ answer: 'yep' }] }],
    },
  );

  const { title, questions } = state;

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
          disabled={
            // has a title,
            // has at least one question,
            // all questions have text and at least one answer,
            // all answers have text
            title.length === 0 ||
            questions.length === 0 ||
            questions.some(
              question =>
                question.question.length === 0 ||
                question.answers.length === 0 ||
                question.answers.some(answer => answer.answer.length === 0),
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
        style={{ marginBottom: 10 }}
        onChange={e => {
          dispatch({ type: 'SET_TITLE', payload: e.target.value });
        }}
      />
      {questions.map((question, qIndex) => (
        <Card key={`question-${qIndex}`} style={{ marginBottom: 10 }}>
          <CardHeader
            action={
              <IconButton
                onClick={() =>
                  dispatch({ type: 'REMOVE_QUESTION', payload: { questionIndex: qIndex } })
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
                value={question.question}
                onChange={e => {
                  dispatch({
                    type: 'SET_QUESTION',
                    payload: { questionIndex: qIndex, value: e.target.value },
                  });
                }}
              />
            }
          />
          <CardContent>
            <List>
              {question.answers.map((answer, aIndex) => (
                <ListItem key={`answer-${qIndex}-${aIndex}`}>
                  <ListItemText>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Answer ${aIndex + 1}`}
                      value={answer.answer}
                      onChange={e => {
                        dispatch({
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
                        dispatch({
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
                onClick={() => dispatch({ type: 'ADD_ANSWER', payload: { questionIndex: qIndex } })}
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
            <IconButton onClick={() => dispatch({ type: 'ADD_QUESTION' })}>
              <Add />
            </IconButton>
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}
