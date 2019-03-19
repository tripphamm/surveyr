import React from 'react';
import { Button, IconButton, Icon } from '@material-ui/core';
import { useMappedState } from 'redux-react-hook';
import { Clear } from '@material-ui/icons';

import Shell from '../../components/Shell';
import useRouter from '../../hooks/useRouter';
import { State } from '../../state/state';
import EmojiIcon from '../../components/EmojiIcon';

const mapState = (s: State) => {
  return {};
};

export default function EditSurvey() {
  const { history, match } = useRouter<{ surveyId: string }>();
  const { params } = match;
  const { surveyId } = params;

  return (
    <Shell
      buttonLeftComponent={
        <IconButton onClick={() => history.push('/')}>
          <EmojiIcon emojiShortName=":bar_chart:" size={32} />
        </IconButton>
      }
      buttonRightComponent={
        <IconButton color="inherit" onClick={() => history.goBack()}>
          <Icon>
            <Clear />
          </Icon>
        </IconButton>
      }
    >
      Editing survey {surveyId}
    </Shell>
  );
}
