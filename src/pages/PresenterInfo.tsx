import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import CopyToClipboard from 'react-copy-to-clipboard';
import Clear from '@material-ui/icons/Clear';

import Shell from '../components/Shell';

import useRouter from '../hooks/useRouter';
import { getSurveyPresenterPath } from '../utils/routeUtil';

import surveyCodeIcon from '../images/survey-code-icon.png';
import Snackbar from '@material-ui/core/Snackbar';
import { bottomBarHeight, avatarSize } from '../settings/magicNumbers';
import IconButton from '@material-ui/core/IconButton';
import { NormalizedSurveyInstances } from '../state/state';
import EmojiIcon from '../components/EmojiIcon';
import UserGate from '../UserGate';

export default function PresenterInfo(props: { surveyInstances: NormalizedSurveyInstances }) {
  const { surveyInstances } = props;

  const { history, match } = useRouter<{ shareCode: string }>();
  const { params } = match;
  const { shareCode } = params;

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <UserGate>
      <Shell
        bottomBarComponent={
          <Button
            style={{ height: '100%', width: '100%' }}
            variant="contained"
            color="primary"
            disabled={surveyInstances[shareCode] === undefined}
            onClick={() => {
              history.push(getSurveyPresenterPath(shareCode));
            }}
          >
            {'Go to presenter mode'}
          </Button>
        }
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Typography variant="display1">{"Here's the low-down"}</Typography>
            <Typography color="textSecondary">(Tap on one for a surprise)</Typography>
          </div>

          <List>
            <CopyToClipboard text={shareCode} onCopy={() => setSnackbarOpen(true)}>
              <ListItem style={{ cursor: 'pointer' }}>
                <ListItemAvatar>
                  <Avatar src={surveyCodeIcon} alt="Survey-code sample" />
                </ListItemAvatar>
                <ListItemText primary={shareCode} secondary="Your survey code" />
              </ListItem>
            </CopyToClipboard>
            <CopyToClipboard
              text={`https://srvy.live/results/${shareCode}`}
              onCopy={() => setSnackbarOpen(true)}
            >
              <ListItem style={{ cursor: 'pointer' }}>
                <ListItemAvatar>
                  <EmojiIcon emojiShortName={':tv:'} size={avatarSize} />
                </ListItemAvatar>
                <ListItemText
                  primary={`https://srvy.live/results/${shareCode}`}
                  secondary="Use this to show the live-results on another screen"
                />
              </ListItem>
            </CopyToClipboard>

            <CopyToClipboard
              text={`https://srvy.live/join/${shareCode}`}
              onCopy={() => setSnackbarOpen(true)}
            >
              <ListItem style={{ cursor: 'pointer' }}>
                <ListItemAvatar>
                  <EmojiIcon emojiShortName={':incoming_envelope:'} size={avatarSize} />
                </ListItemAvatar>
                <ListItemText
                  primary={`https://srvy.live/join/${shareCode}`}
                  secondary="Send this to your participants, or just have them enter the survey code on srvy.live"
                />
              </ListItem>
            </CopyToClipboard>
          </List>
        </div>
        <Snackbar
          style={{ height: bottomBarHeight }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message="Copied!"
          autoHideDuration={2000}
          action={
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <Clear />
            </IconButton>
          }
        />
      </Shell>
    </UserGate>
  );
}
