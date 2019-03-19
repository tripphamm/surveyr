import React from 'react';
import {
  Button,
  IconButton,
  Typography,
  Link,
  ListItem,
  List,
  ListItemText,
  Fab,
} from '@material-ui/core';
import { useMappedState } from 'redux-react-hook';

import Shell from '../../components/Shell';
import useRouter from '../../hooks/useRouter';
import { State } from '../../state/state';
import { auth } from '../../services/firebaseService';
import EmojiIcon from '../../components/EmojiIcon';
import FloatingAddButton from '../../components/FloatingAddButton';

const mapState = (s: State) => {
  return {};
};

export default function HostHome() {
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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, i) => (
          <ListItem key={i} onClick={() => history.push('/host/surveys/' + i)}>
            <ListItemText>Survey {i}</ListItemText>
          </ListItem>
        ))}
      </List>
      <FloatingAddButton onClick={() => history.push('/host/surveyEditor')} />
    </Shell>
  );
}
