import React from 'react';
import { IconButton, Icon, Typography, withTheme, Theme } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import Shell from '../components/Shell';
import useRouter from '../hooks/useRouter';
import EmojiIcon from '../components/EmojiIcon';
import AnimatedBar from '../components/AnimatedBar';
import useSurveyResponses from '../hooks/useSurveyResponses';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';
import { SurveyInstance, NormalizedSurvey } from '../state/state';

function SurveyResults(props: {
  theme: Theme;
  surveyInstance: SurveyInstance;
  survey: NormalizedSurvey;
}) {
  const { surveyInstance, survey, theme } = props;

  const { history } = useRouter();

  const currentQuestion = survey.questions[surveyInstance.currentQuestionId];

  const [surveyResponses] = useSurveyResponses(surveyInstance.id);

  if (surveyResponses.loading) {
    return <Loading />;
  }

  if (surveyResponses.errorCode !== undefined) {
    return <ErrorMessage />;
  }

  // surveyResponses is not loading and has no error, so it should exist
  if (surveyResponses.value === undefined) {
    // todo: log error
    return <ErrorMessage />;
  }

  let responses: { [answerId: string]: number } = {};
  if (surveyResponses.value[surveyInstance.currentQuestionId] !== undefined) {
    responses = surveyResponses.value[surveyInstance.currentQuestionId].reduce<{
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
          {surveyInstance.shareCode}
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
              {surveyInstance.showResults && (
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

export default withTheme()(SurveyResults);
