import React from 'react';
import withTheme from '@material-ui/core/styles/withTheme';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';

import Shell from '../components/Shell';
import useRouter from '../hooks/useRouter';
import EmojiIcon from '../components/EmojiIcon';
import { NormalizedSurveys, NormalizedSurveyInstances, SurveyInstance } from '../state/state';
import AnimatedBar from '../components/AnimatedBar';
import useSurveyResponses from '../hooks/useSurveyResponses';
import { denormalizeSurvey } from '../utils/normalizationUtil';
import Loading from './Loading';
import NotFound from './NotFound';
import { getSurveyPath } from '../utils/routeUtil';
import UserGate from '../UserGate';

function Presenter(props: {
  theme: Theme;
  surveys: NormalizedSurveys;
  surveyInstances: NormalizedSurveyInstances;
  updateSurveyInstance: (
    surveyInstanceId: string,
    surveyInstanceUpdate: Partial<SurveyInstance>,
  ) => Promise<void>;
  deleteSurveyInstance: (surveyInstanceId: string) => Promise<void>;
}) {
  const { theme, surveys, surveyInstances, updateSurveyInstance, deleteSurveyInstance } = props;

  const { history, match } = useRouter<{ shareCode: string }>();
  const { params } = match;
  const { shareCode } = params;

  const surveyInstance = surveyInstances[shareCode];

  const surveyResponses = useSurveyResponses(surveyInstance ? surveyInstance.id : undefined);

  if (surveyInstance === undefined) {
    return <NotFound />;
  }

  if (surveyResponses.loading) {
    return <Loading />;
  }

  if (surveyResponses.errorCode !== undefined) {
    throw new Error(`SurveyResponses error: ${surveyResponses.errorCode}`);
  }

  // surveyResponses is not loading and it doesn't have errors, so the data must be available
  if (surveyResponses.value === undefined) {
    // todo: log
    throw new Error(`SurveyResponses is not loading and has no error, but value is undefined`);
  }

  const normalizedSurvey = surveys[surveyInstance.surveyId];

  if (!normalizedSurvey) {
    return <NotFound />;
  }

  const survey = denormalizeSurvey(normalizedSurvey);

  if (survey.questions.length === 0) {
    // todo log
    throw new Error('Survey has no questions');
  }

  const currentQuestion = normalizedSurvey.questions[surveyInstance.currentQuestionId];

  // count the responses for each answer
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
    <UserGate>
      <Shell
        title={`Srvy | ${surveyInstance.shareCode}`}
        buttonLeftComponent={
          <IconButton onClick={() => history.push('/')}>
            <EmojiIcon emojiShortName=":bar_chart:" size={32} />
          </IconButton>
        }
        buttonRightComponent={
          <Button
            color="inherit"
            onClick={async () => {
              await deleteSurveyInstance(surveyInstance.id);
              history.push(getSurveyPath(survey.id));
            }}
          >
            End survey
          </Button>
        }
        bottomBarComponent={
          <div style={{ height: '100%' }}>
            <Button
              style={{ height: 'inherit', width: '50%' }}
              variant="contained"
              color="primary"
              disabled={currentQuestion.number === 0}
              onClick={() => {
                if (currentQuestion.number > 0) {
                  updateSurveyInstance(surveyInstance.id, {
                    currentQuestionId: survey.questions[currentQuestion.number - 1].id,
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
              disabled={currentQuestion.number === survey.questions.length - 1}
              onClick={() => {
                if (currentQuestion.number < survey.questions.length - 1) {
                  updateSurveyInstance(surveyInstance.id, {
                    currentQuestionId: survey.questions[currentQuestion.number + 1].id,
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
            {shareCode}
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
                {/* TypeScript pls. Why do I suddenly need ! */}
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
    </UserGate>
  );
}

export default withTheme()(Presenter);
