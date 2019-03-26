import React from 'react';
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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import uuidv4 from 'uuid/v4';

import Shell from '../components/Shell';
import useRouter from '../hooks/useRouter';
import EmojiIcon from '../components/EmojiIcon';
import FloatingEditButton from '../components/FloatingEditButton';
import { NormalizedSurveys, User, NormalizedSurveyInstances } from '../state/state';
import NotFound from './NotFound';
import { getSurveyPresenterInfoPath, getEditSurveyPath, getSurveysPath } from '../utils/routeUtil';
import ErrorMessage from './ErrorMessage';
import UserGate from '../UserGate';

export default function Survey(props: {
  surveys: NormalizedSurveys;
  surveyInstances: NormalizedSurveyInstances;
  addSurveyInstance: (
    surveyId: string,
    initialQuestionId: string,
    shareCode: string,
  ) => Promise<void>;
  deleteSurveyInstance: (surveyInstanceId: string) => Promise<void>;
}) {
  const { surveys, surveyInstances, addSurveyInstance, deleteSurveyInstance } = props;

  const { history, match } = useRouter<{ surveyId: string }>();
  const { params } = match;
  const { surveyId } = params;

  const survey = surveys[surveyId];
  const surveyInstancesForThisSurvey = Object.values(surveyInstances).filter(
    surveyInstance => surveyInstance.surveyId === survey.id,
  );

  const defaultQuestion = Object.values(survey.questions).find(question => question.number === 0);

  if (defaultQuestion === undefined) {
    // todo log
    return <ErrorMessage />;
  }

  if (survey === undefined) {
    return <NotFound />;
  }

  return (
    <UserGate>
      <Shell
        buttonLeftComponent={
          <IconButton onClick={() => history.push('/')}>
            <EmojiIcon emojiShortName=":bar_chart:" size={32} />
          </IconButton>
        }
        buttonRightComponent={
          <IconButton color="inherit" onClick={() => history.push(getSurveysPath())}>
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
              const shareCode = uuidv4()
                .slice(0, 4)
                .toUpperCase();

              history.push(getSurveyPresenterInfoPath(shareCode));

              addSurveyInstance(survey.id, defaultQuestion.id, shareCode);
            }}
          >
            Start
          </Button>
        }
      >
        <Typography variant="display1" gutterBottom>
          {survey.title}
        </Typography>
        {surveyInstancesForThisSurvey.length > 0 && (
          <Card style={{ marginBottom: 15 }}>
            <CardHeader title="Active surveys" titleTypographyProps={{ color: 'primary' }} />
            <CardContent>
              <List>
                {surveyInstancesForThisSurvey.map((surveyInstance, i) => (
                  <ListItem
                    key={`survey-instance-${i}`}
                    onClick={() =>
                      history.push(getSurveyPresenterInfoPath(surveyInstance.shareCode))
                    }
                  >
                    <ListItemText>{surveyInstance.shareCode}</ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="Delete"
                        onClick={() => deleteSurveyInstance(surveyInstance.id)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {Object.values(survey.questions).map((question, qIndex) => (
          <Card key={`question-${qIndex}`} style={{ marginBottom: 15 }}>
            <CardHeader title={question.value} />
            <CardContent>
              <List>
                {Object.values(question.possibleAnswers).map((answer, aIndex) => (
                  <ListItem key={`answer-${qIndex}-${aIndex}`}>
                    <ListItemText primary={answer.value} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
        <FloatingEditButton onClick={() => history.push(getEditSurveyPath(surveyId))} />
      </Shell>
    </UserGate>
  );
}
