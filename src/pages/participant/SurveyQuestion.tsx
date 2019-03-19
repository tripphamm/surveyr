import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  FormLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Icon,
  IconButton,
} from '@material-ui/core';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Clear } from '@material-ui/icons';

import Shell from '../../components/Shell';
import EmojiIcon from '../../components/EmojiIcon';
import useRouter from '../../hooks/useRouter';
import { getSurvey, leaveSurvey, submitAnswer } from '../../state/actions';
import { State, SurveyInstance } from '../../state/state';
import Loading from '../../components/Loading';

const mapState = (s: State) => {
  return {
    // assume surveyInstance is defined since we won't render this component unless that's the case
    surveyInstance: s.surveyInstance.value as SurveyInstance,
    survey: s.survey.value,
    surveyLoading: s.survey.loading,
    surveyError: s.survey.errorCode,
    participantAnswers: s.participantAnswers,
  };
};

export default function SurveyQuestion() {
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [answerId, setAnswerId] = useState<string | undefined>(undefined);
  const { history } = useRouter();
  const dispatch = useDispatch();
  const { participantAnswers, surveyInstance, survey } = useMappedState(mapState);

  useEffect(() => {
    dispatch(getSurvey(surveyInstance.surveyId));
  }, [surveyInstance.surveyId]);

  if (survey === undefined) {
    return <Loading />;
  }

  const currentQuestion = survey.questions[surveyInstance.currentQuestionId];

  if (currentQuestion === undefined) {
    throw new Error("Current question doesn't exist in the survey");
  }

  const currentAnswer = participantAnswers[currentQuestion.id];

  return (
    <Shell
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
      buttonRightComponent={
        <IconButton color="inherit" onClick={() => dispatch(leaveSurvey())}>
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
            setSubmitting(true);
            // assumed answerId is not undefined since the button should be disabled in that case
            await dispatch(submitAnswer(surveyInstance.id, currentQuestion.id, answerId!));
            setEditMode(false);
            setSubmitting(false);
          }}
          disabled={answerId === undefined || submitting}
        >
          Submit
        </Button>
      }
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h4">{currentQuestion.value}</Typography>
        </div>
        {editMode ? (
          <FormControl>
            <FormLabel>Your answer</FormLabel>
            <RadioGroup
              aria-label="Your answer"
              name="question"
              value={answerId}
              onChange={e => setAnswerId((e.target as HTMLInputElement).value)}
            >
              {Object.entries(currentQuestion.possibleAnswers).map(([answerId, answer]) => (
                <FormControlLabel
                  key={answerId}
                  value={answerId}
                  control={<Radio />}
                  label={answer.value}
                />
              ))}
            </RadioGroup>
          </FormControl>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h5" style={{ marginBottom: 50 }}>
              {currentQuestion.possibleAnswers[currentAnswer].value}
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => setEditMode(true)}>
              Change answer
            </Button>
          </div>
        )}
      </div>
    </Shell>
  );
}
