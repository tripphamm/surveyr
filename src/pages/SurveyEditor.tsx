import React, { useReducer } from 'react';
import uuidv4 from 'uuid/v4';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Clear from '@material-ui/icons/Clear';

import useRouter from '../hooks/useRouter';
import { UnsavedSurvey, Question, Answer } from '../state/state';
import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';

const reduce = (
  state: { survey: UnsavedSurvey; autoFocusedId?: string },
  action: { type: string; payload?: any },
) => {
  // deep-clone the questions so that we can use destructive methods when updating the state
  // without mutating the in-use state
  const clonedQuestions = state.survey.questions.reduce<Question[]>((questionsClone, question) => {
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
        survey: {
          ...state.survey,
          title: action.payload,
        },
      };
    case 'SET_QUESTION':
      clonedQuestions[action.payload.questionIndex].value = action.payload.value;
      return {
        ...state,
        survey: {
          ...state.survey,
          questions: clonedQuestions,
        },
      };
    case 'SET_ANSWER':
      clonedQuestions[action.payload.questionIndex].possibleAnswers[
        action.payload.answerIndex
      ].value = action.payload.value;
      return {
        ...state,
        survey: {
          ...state.survey,
          questions: clonedQuestions,
        },
      };
    case 'ADD_ANSWER':
      const newAnswerId = uuidv4();
      clonedQuestions[action.payload.questionIndex].possibleAnswers.push({
        id: newAnswerId,
        value: '',
      });
      return {
        ...state,
        autoFocusedId: newAnswerId,
        survey: {
          ...state.survey,
          questions: clonedQuestions,
        },
      };
    case 'ADD_QUESTION':
      const newQuestionId = uuidv4();
      clonedQuestions.push({
        id: newQuestionId,
        value: '',
        possibleAnswers: [{ id: uuidv4(), value: '' }],
      });
      return {
        ...state,
        autoFocusedId: newQuestionId,
        survey: {
          ...state.survey,
          questions: clonedQuestions,
        },
      };
    case 'REMOVE_ANSWER':
      clonedQuestions[action.payload.questionIndex].possibleAnswers.splice(
        action.payload.answerIndex,
        1,
      );
      return {
        ...state,
        survey: {
          ...state.survey,
          questions: clonedQuestions,
        },
      };
    case 'REMOVE_QUESTION':
      clonedQuestions.splice(action.payload.questionIndex, 1);
      return {
        ...state,
        survey: {
          ...state.survey,
          questions: clonedQuestions,
        },
      };
    default:
      return state;
  }
};

export default function SurveyEditor(props: {
  initialSurveyData: UnsavedSurvey;
  onSave: (unsavedSurvey: UnsavedSurvey) => Promise<void>;
  onDelete?: (surveyId: string) => Promise<void>;
}) {
  const { initialSurveyData, onSave, onDelete } = props;

  const [state, dispatchLocal] = useReducer<
    React.Reducer<
      { survey: UnsavedSurvey; autoFocusedId?: string },
      { type: string; payload?: any }
    >
  >(reduce, { survey: initialSurveyData, autoFocusedId: undefined });

  const { survey: unsavedSurvey, autoFocusedId } = state;

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
          onClick={() => {
            onSave(unsavedSurvey);
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
        autoFocus={autoFocusedId === undefined}
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
                autoFocus={autoFocusedId === question.id}
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
                      autoFocus={autoFocusedId === answer.id}
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
      <Card style={{ marginBottom: 15 }}>
        <CardContent>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <IconButton onClick={() => dispatchLocal({ type: 'ADD_QUESTION' })}>
              <Add />
            </IconButton>
          </div>
        </CardContent>
      </Card>
      {unsavedSurvey.id !== undefined && typeof onDelete === 'function' && (
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => onDelete(unsavedSurvey.id!)}
        >
          Delete
        </Button>
      )}
    </Shell>
  );
}
