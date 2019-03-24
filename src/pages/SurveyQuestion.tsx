import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { useMappedState } from 'redux-react-hook';

import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';
import useRouter from '../hooks/useRouter';
import { radioButtonIconSize } from '../settings/magicNumbers';
import useMyResponses from '../hooks/useMyResponses';
import { State, SurveyInstance, NormalizedSurvey } from '../state/state';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

const mapState = (state: State) => {
  return {
    // we assume that user has a value since we shouldn't render this component otherwise
    user: state.user.value!,
  };
};

export default function SurveyQuestion(props: {
  surveyInstance: SurveyInstance;
  survey: NormalizedSurvey;
}) {
  const { surveyInstance, survey } = props;

  const [submission, setSubmission] = useState<{ submitting: boolean; value: null | string }>({
    submitting: false,
    value: null,
  });

  const { user } = useMappedState(mapState);
  const { history } = useRouter();

  const currentQuestion = survey.questions[surveyInstance.currentQuestionId];

  if (currentQuestion === undefined) {
    // todo: log
    throw new Error("Current question doesn't exist in the survey");
  }

  const [myResponses, submitAnswer] = useMyResponses(user.id, surveyInstance.id);

  if (myResponses.loading) {
    return <Loading />;
  }

  if (myResponses.errorCode !== undefined) {
    return <ErrorMessage />;
  }

  // myResponses is not loading and has no error, so the value should exist
  const currentResponse = myResponses.value![currentQuestion.id];

  return (
    <Shell
      title={`Srvy | ${surveyInstance.shareCode}`}
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
      buttonRightComponent={
        <IconButton color="inherit" onClick={() => history.push('/')}>
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
            value={currentResponse ? currentResponse.answerId : undefined}
            onChange={async e => {
              const value = (e.target as HTMLInputElement).value;
              setSubmission({ submitting: true, value });
              await submitAnswer({
                ...currentResponse,
                questionId: currentQuestion.id,
                answerId: value,
              });
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
                    checked={currentResponse && answerId === currentResponse.answerId}
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
