import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import useRouter from '../hooks/useRouter';

import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';
import FloatingAddButton from '../components/FloatingAddButton';

import { auth } from '../services/firebaseService';
import { NormalizedSurveys, NormalizedSurveyInstances } from '../entities';
import { getSurveyPath, getCreateSurveyPath, getHowItWorksPath } from '../utils/routeUtil';
import HowItWorksSteps from '../components/HowItWorksSteps';
import { floatingActionButtonBufferSize } from '../settings/magicNumbers';

export default function Surveys(props: {
  surveys: NormalizedSurveys;
  surveyInstances: NormalizedSurveyInstances;
}) {
  const { surveys, surveyInstances } = props;

  const { history } = useRouter();

  return (
    <Shell
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
      buttonRightComponent={
        <Button color="inherit" onClick={() => auth.signOut()}>
          Logout
        </Button>
      }
    >
      {Object.values(surveys).length === 0 ? (
        <div
          style={{
            height: `calc(100% - ${floatingActionButtonBufferSize}px)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <Typography
            data-test-id="surveys-page-header"
            variant="display1"
            style={{ textAlign: 'center' }}
          >
            {"Let's get started"}
          </Typography>
          <HowItWorksSteps />
        </div>
      ) : (
        <div>
          <Link style={{ marginBottom: 20 }} to={getHowItWorksPath()}>
            <Typography color="primary">{'How does this work again?'}</Typography>
          </Link>
          <List>
            {Object.values(surveys)
              .sort((a, b) => {
                // sort alphabetically by title
                const aT = a.title.toLowerCase();
                const bT = b.title.toLowerCase();
                if (aT < bT) {
                  return -1;
                }
                if (aT > bT) {
                  return 1;
                }
                return 0;
              })
              .map((survey, i) => (
                <Link
                  key={`survey-${i}`}
                  style={{ textDecoration: 'none' }}
                  to={getSurveyPath(survey.id)}
                >
                  <ListItem>
                    <ListItemText
                      secondary={`${Object.values(survey.questions).length} question${
                        Object.values(survey.questions).length === 1 ? '' : 's'
                      }`}
                    >
                      {survey.title}
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Badge
                        badgeContent={
                          Object.values(surveyInstances).filter(
                            surveyInstance => surveyInstance.surveyId === survey.id,
                          ).length
                        }
                        color="primary"
                      >
                        <div />
                      </Badge>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Link>
              ))}
          </List>
        </div>
      )}

      <FloatingAddButton
        data-test-id="create-survey-fab"
        onClick={() => history.push(getCreateSurveyPath())}
      />
    </Shell>
  );
}
