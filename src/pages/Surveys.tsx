import React from 'react';
import { Button, IconButton, ListItem, List, ListItemText } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';

import useRouter from '../hooks/useRouter';

import Shell from '../components/Shell';
import EmojiIcon from '../components/EmojiIcon';
import FloatingAddButton from '../components/FloatingAddButton';

import { auth } from '../services/firebaseService';
import { NormalizedSurveys } from '../state/state';
import { getSurveyPath, getCreateSurveyPath } from '../utils/routeUtil';

export default function Surveys(props: RouteComponentProps & { surveys: NormalizedSurveys }) {
  const { surveys } = props;

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
            <ListItem key={i} onClick={() => history.push(getSurveyPath(survey.id))}>
              <ListItemText
                secondary={`${Object.values(survey.questions).length} question${
                  Object.values(survey.questions).length === 1 ? '' : 's'
                }`}
              >
                {survey.title}
              </ListItemText>
            </ListItem>
          ))}
      </List>
      <FloatingAddButton onClick={() => history.push(getCreateSurveyPath())} />
    </Shell>
  );
}
