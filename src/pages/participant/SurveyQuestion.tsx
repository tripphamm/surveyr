import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Typography,
  FormLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Icon,
  IconButton,
} from '@material-ui/core';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Clear, RadioButtonUnchecked } from '@material-ui/icons';

import Shell from '../../components/Shell';
import EmojiIcon from '../../components/EmojiIcon';
import useRouter from '../../hooks/useRouter';
import { getSurvey, leaveSurvey, submitAnswer } from '../../state/actions';
import { State, SurveyInstance } from '../../state/state';
import Loading from '../../components/Loading';
import { radioButtonIconSize } from '../../settings/magicNumbers';

const mapState = (s: State) => {
  return {
    // assume surveyInstance is defined since we won't render this component unless that's the case
    surveyInstance: s.surveyInstance.value as SurveyInstance,
    activeSurvey: s.activeSurvey.value,
    activeSurveyLoading: s.activeSurvey.loading,
    activeSurveyError: s.activeSurvey.errorCode,
    participantAnswers: s.participantAnswers,
  };
};

export default function SurveyQuestion() {
  const [submission, setSubmission] = useState<{ submitting: boolean; value: null | string }>({
    submitting: false,
    value: null,
  });
  const { history } = useRouter();
  const dispatch = useDispatch();
  const { participantAnswers, surveyInstance, activeSurvey } = useMappedState(mapState);

  const { surveyId } = surveyInstance;

  useEffect(() => {
    dispatch(getSurvey(surveyId));
  }, [dispatch, surveyId]);

  if (activeSurvey === undefined) {
    return <Loading />;
  }

  const currentQuestion = activeSurvey.questions[surveyInstance.currentQuestionId];

  if (currentQuestion === undefined) {
    throw new Error("Current question doesn't exist in the survey");
  }

  const answers = participantAnswers[surveyInstance.id] || {};
  const currentAnswerId = answers[currentQuestion.id];

  return (
    <Shell
      title={`Srvy | ${surveyInstance.shareCode}`}
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
        <FormControl>
          <FormLabel>Your answer</FormLabel>
          <RadioGroup
            aria-label="Your answer"
            name={`question-${currentQuestion.id}-answers`}
            value={currentAnswerId}
            onChange={async e => {
              const value = (e.target as HTMLInputElement).value;
              setSubmission({ submitting: true, value });
              await dispatch(submitAnswer(surveyInstance.id, currentQuestion.id, value));
              setSubmission({ submitting: false, value: null });
            }}
          >
            {Object.entries(currentQuestion.possibleAnswers).map(([answerId, answer]) => (
              <FormControlLabel
                key={answerId}
                disabled={submission.submitting}
                value={answerId}
                control={
                  <Radio
                    checked={answerId === currentAnswerId}
                    icon={
                      submission.submitting && answerId === submission.value ? (
                        <CircularProgress size={radioButtonIconSize} />
                      ) : (
                        <RadioButtonUnchecked />
                      )
                    }
                  />
                }
                label={answer.value}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </Shell>
  );
}
