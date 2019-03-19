import React, { useEffect } from 'react';
import { Button, IconButton, ListItem, List, ListItemText } from '@material-ui/core';
import { useMappedState, useDispatch } from 'redux-react-hook';

import Shell from '../../components/Shell';
import useRouter from '../../hooks/useRouter';
import { State } from '../../state/state';
import { auth } from '../../services/firebaseService';
import EmojiIcon from '../../components/EmojiIcon';
import FloatingAddButton from '../../components/FloatingAddButton';
import { subscribeToMySurveys } from '../../state/actions';
import Loading from '../../components/Loading';

const mapState = (s: State) => {
  return {
    user: s.user.value,
    mySurveys: s.mySurveys.value,
  };
};

export default function HostHome() {
  const { history } = useRouter();
  const dispatch = useDispatch();

  const { user, mySurveys } = useMappedState(mapState);

  useEffect(() => {
    dispatch(subscribeToMySurveys());
  }, [dispatch]);

  if (mySurveys === undefined) {
    return <Loading />;
  }

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
        {Object.values(mySurveys)
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
            <ListItem key={i} onClick={() => history.push(`/host/surveys/${survey.id}`)}>
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
      <FloatingAddButton onClick={() => history.push('/host/surveyEditor')} />
    </Shell>
  );
}
