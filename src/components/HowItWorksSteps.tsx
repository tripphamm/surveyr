import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import createSurveyIcon from '../images/create-survey-icon.png';
import startSurveyIcon from '../images/start-survey-icon.png';
import surveyCodeIcon from '../images/survey-code-icon.png';
import { getImageSrcByShortName } from '../utils/emojiUtil';
import EmojiIcon from './EmojiIcon';
import { avatarSize } from '../settings/magicNumbers';

export default function HowItWorksSteps() {
  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={createSurveyIcon} alt="Create-survey button" />
        </ListItemAvatar>
        <ListItemText primary="Create a survey" secondary="The hardest part is picking a title" />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar src={startSurveyIcon} alt="Start-survey button" />
        </ListItemAvatar>
        <ListItemText primary="Click the big START button" secondary="Now we're cookin'" />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar src={surveyCodeIcon} alt="Survey-code sample" />
        </ListItemAvatar>
        <ListItemText
          primary="Find an audience, and give them the secret code"
          secondary="Oh, and tell them to go to srvy.live on their phones"
        />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <EmojiIcon emojiShortName={':tv:'} size={avatarSize} />
        </ListItemAvatar>
        <ListItemText
          primary="Put the live-results up on a big screen somewhere"
          secondary="And control the presentation from your phone"
        />
      </ListItem>
    </List>
  );
}
