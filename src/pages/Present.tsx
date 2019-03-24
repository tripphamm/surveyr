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
import { RouteComponentProps } from 'react-router-dom';

import Shell from '../components/Shell';
import useRouter from '../hooks/useRouter';
import EmojiIcon from '../components/EmojiIcon';
import { State, NormalizedSurveys } from '../state/state';
import AnimatedBar from '../components/AnimatedBar';
import { useMappedState } from 'redux-react-hook';
import useHostedSurveyInstance from '../hooks/useHostedSurveyInstance';
import ErrorMessage from './ErrorMessage';
import useSurveyResponses from '../hooks/useSurveyResponses';
import { denormalizeSurvey } from '../utils/normalizationUtil';
import Loading from './Loading';

const mapState = (state: State) => {
  return {
    user: state.user.value,
  };
};

function Present(props: RouteComponentProps & { theme: Theme; surveys: NormalizedSurveys }) {
  const { theme, surveys } = props;

  const { user } = useMappedState(mapState);

  if (!user) {
    throw {
      type: 'ERROR',
      logMessage: 'No User in <Present />',
    };
  }

  const { history, match } = useRouter<{ surveyId: string }>();
  const { params } = match;
  const { surveyId } = params;

  const normalizedSurvey = surveys[surveyId];

  if (!normalizedSurvey) {
    throw {
      type: 'NOT_FOUND',
      userMessage: "Hm. We can't find that survey",
    };
  }

  const survey = denormalizeSurvey(normalizedSurvey);

  if (survey.questions.length === 0) {
    throw {
      type: 'ERROR',
      logMessage: 'Hosted survey has 0 questions',
    };
  }

  const currentQuestionId = survey.questions[0].id;

  const [hostedSurvey, updateHostedSurvey, deleteHostedSurvey] = useHostedSurveyInstance(
    user.id,
    surveyId,
    currentQuestionId,
  );

  const [surveyResponses, deleteSurveyResponses] = useSurveyResponses(
    hostedSurvey.value ? hostedSurvey.value.id : undefined,
  );

  if (hostedSurvey.loading || surveyResponses.loading) {
    return <Loading />;
  }

  if (hostedSurvey.errorCode !== undefined || surveyResponses.errorCode !== undefined) {
    return <ErrorMessage />;
  }

  // hostedSurvey and surveyResponses are not loading and they don't have errors, so the data must be available
  if (hostedSurvey.value === undefined || surveyResponses.value === undefined) {
    // todo: log
    return <ErrorMessage />;
  }

  const currentQuestion = normalizedSurvey.questions[hostedSurvey.value.currentQuestionId];

  // count the responses for each answer
  let responses: { [answerId: string]: number } = {};
  if (surveyResponses.value[hostedSurvey.value.currentQuestionId] !== undefined) {
    responses = surveyResponses.value[hostedSurvey.value.currentQuestionId].reduce<{
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
      title={`Srvy | ${hostedSurvey.value.shareCode}`}
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
      buttonRightComponent={
        <IconButton
          color="inherit"
          onClick={async () => {
            history.goBack();

            await deleteSurveyResponses();
            await deleteHostedSurvey();
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
                updateHostedSurvey({
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
            onClick={() => {
              if (currentQuestion.number < survey.questions.length - 1) {
                updateHostedSurvey({
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
          {hostedSurvey.value.shareCode}
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
              {hostedSurvey.value!.showResults && (
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
