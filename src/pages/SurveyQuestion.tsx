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

import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';
import useRouter from '../hooks/useRouter';
import { radioButtonIconSize } from '../settings/magicNumbers';
import useMyResponses from '../hooks/useMyResponses';
import Loading from './Loading';
import UserGate from '../UserGate';
import Button from '@material-ui/core/Button';
import { getSurveyResultsPath, getSurveyQuestionPath } from '../utils/routeUtil';
import { SurveyInstance, NormalizedSurvey } from '../entities';
import useSession from '../hooks/useSession';

export default function SurveyQuestion(props: {
  surveyInstance: SurveyInstance;
  survey: NormalizedSurvey;
}) {
  const { surveyInstance, survey } = props;

  const [submission, setSubmission] = useState<{ submitting: boolean; value: null | string }>({
    submitting: false,
    value: null,
  });

  const { user } = useSession();
  if (user === null || user === undefined) {
    throw new Error('Missing user on SurveyQuestion page');
  }

  const { history, match } = useRouter<{ shareCode: string }>();
  const { params } = match;
  const { shareCode } = params;

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
    throw new Error(`myResponses error: ${myResponses.errorCode}`);
  }

  // myResponses is not loading and has no error, so the value should exist
  const currentResponse = myResponses.value![currentQuestion.id];

  return (
    <UserGate allowAnonymous>
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
        bottomBarComponent={
          <div style={{ height: '100%' }}>
            <Button
              style={{ height: 'inherit', width: '50%' }}
              variant="contained"
              color="primary"
              disabled
              onClick={() => {
                history.push(getSurveyQuestionPath(shareCode));
              }}
            >
              My answer
            </Button>
            <Button
              style={{ height: 'inherit', width: '50%' }}
              variant="contained"
              color="primary"
              onClick={() => {
                history.push(getSurveyResultsPath(shareCode));
              }}
            >
              Results
            </Button>
          </div>
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
    </UserGate>
  );
}
