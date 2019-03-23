import React, { useEffect } from 'react';
import { Button, IconButton, Icon, Typography, withTheme, Theme } from '@material-ui/core';
import { Clear, ArrowBack, ArrowForward } from '@material-ui/icons';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Redirect } from 'react-router-dom';

import Shell from '../../components/Shell';
import useRouter from '../../hooks/useRouter';
import EmojiIcon from '../../components/EmojiIcon';
import { State } from '../../state/state';
import NotFound from '../NotFound';
import { subscribeToSurveyAnswers, stopHostingSurvey } from '../../state/actions';
import { firestore } from '../../services/firebaseService';
import AnimatedBar from '../../components/AnimatedBar';

const mapState = (state: State) => {
  return {
    hostedSurvey: state.hostedSurvey.value,
    mySurveys: state.mySurveys.value,
    surveyAnswers: state.surveyAnswers.value,
  };
};

function Present(props: { theme: Theme }) {
  const dispatch = useDispatch();

  const { history } = useRouter();

  const { theme } = props;

  const { hostedSurvey, mySurveys, surveyAnswers } = useMappedState(mapState);

  const hostedSurveyId = hostedSurvey ? hostedSurvey.id : undefined;
  useEffect(() => {
    if (hostedSurveyId !== undefined) {
      dispatch(subscribeToSurveyAnswers(hostedSurveyId));
    }
  }, [dispatch, hostedSurveyId]);

  if (hostedSurvey === undefined || mySurveys === undefined) {
    return <Redirect to="/host/surveys" />;
  }

  const survey = mySurveys[hostedSurvey.surveyId];

  if (survey === undefined) {
    return <NotFound />;
  }

  const questions = Object.values(survey.questions).sort((a, b) => a.number - b.number);
  const currentQuestion = survey.questions[hostedSurvey.currentQuestionId];

  let responses: { [answerId: string]: number } = {};
  if (surveyAnswers !== undefined && surveyAnswers[hostedSurvey.currentQuestionId] !== undefined) {
    responses = surveyAnswers[hostedSurvey.currentQuestionId].reduce<{
      [answerId: string]: number;
    }>((r, surveyAnswer) => {
      if (r[surveyAnswer.answerId] === undefined) {
        r[surveyAnswer.answerId] = 1;
      } else {
        r[surveyAnswer.answerId] = r[surveyAnswer.answerId] + 1;
      }

      return r;
    }, {});
  }

  const responsesCount = Object.values(responses).reduce((acc, count) => acc + count, 0);

  console.log(responses, hostedSurvey);
  return (
    <Shell
      title={`Srvy | ${hostedSurvey.shareCode}`}
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
      buttonRightComponent={
        <IconButton
          color="inherit"
          onClick={async () => {
            await dispatch(stopHostingSurvey());
            history.push('/host/surveys');
          }}
        >
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
            onClick={() => {
              if (currentQuestion.number > 0) {
                firestore
                  .collection('survey-instances')
                  .doc(hostedSurveyId)
                  .update({
                    currentQuestionId: questions[currentQuestion.number - 1].id,
                  });
              }
            }}
          >
            <ArrowBack />
          </Button>
          <Button
            style={{ height: 'inherit', width: '50%' }}
            variant="contained"
            color="primary"
            onClick={() => {
              if (currentQuestion.number < questions.length - 1) {
                firestore
                  .collection('survey-instances')
                  .doc(hostedSurveyId)
                  .update({
                    currentQuestionId: questions[currentQuestion.number + 1].id,
                  });
              }
            }}
          >
            <ArrowForward />
          </Button>
        </div>
      }
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',

          textAlign: 'center',
        }}
      >
        <Typography
          style={{ position: 'absolute', top: 10, left: 10 }}
          variant="h5"
          color="textSecondary"
        >
          {hostedSurvey.shareCode}
        </Typography>

        <Typography
          style={{ position: 'absolute', top: 10, right: 10 }}
          variant="h5"
          color="textSecondary"
        >
          {`${responsesCount} response${responsesCount !== 1 ? 's' : ''}`}
        </Typography>

        <Typography variant="h4">{currentQuestion.value}</Typography>

        {currentQuestion &&
          Object.values(currentQuestion.possibleAnswers).map(possibleAnswer => (
            <div key={`presentation-answer-${possibleAnswer.id}`} style={{ width: '100%' }}>
              <Typography variant="h5">{possibleAnswer.value}</Typography>
              {hostedSurvey.showResults && (
                <AnimatedBar
                  value={
                    responsesCount > 0 && responses[possibleAnswer.id] !== undefined
                      ? (100 * responses[possibleAnswer.id]) / responsesCount
                      : 0
                  }
                  color={theme.palette.primary.main}
                  borderColor={theme.palette.divider}
                />
              )}
            </div>
          ))}
      </div>
    </Shell>
  );
}

export default withTheme()(Present);
