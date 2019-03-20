import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Div100vh from 'react-div-100vh';

import { topBarHeight, bottomBarHeight } from '../settings/magicNumbers';
import EmojiIcon from './EmojiIcon';

type ShellProps = React.HTMLProps<HTMLDivElement> & {
  title?: string;
  buttonLeftComponent?: React.ReactNode;
  buttonRightComponent?: React.ReactNode;
  bottomBarComponent?: React.ReactNode;
};

export default function Shell(props: ShellProps) {
  const {
    title = 'Srvy',
    buttonLeftComponent = (
      <IconButton color="inherit">
        <EmojiIcon emojiShortName=":bar_chart:" size={32} />
      </IconButton>
    ),
    buttonRightComponent,
    bottomBarComponent,
    children,
  } = props;

  const bottomBarBuffer = bottomBarComponent ? bottomBarHeight : 0;

  return (
    <Div100vh
      style={{
        position: 'relative',
        height: '100rvh',
        overflow: 'hidden',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          {buttonLeftComponent}
          {/* flexGrow is required to push the right IconButton to the right side */}
          <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {buttonRightComponent}
        </Toolbar>
      </AppBar>
      <div
        style={{
          boxSizing: 'border-box',
          // set the size of the viewport (between the app bar and bottom nav)
          height: `calc(100% - ${topBarHeight + bottomBarBuffer}px)`,
          overflow: 'auto',
          padding: 20,
        }}
      >
        {children}
      </div>
      {bottomBarComponent && (
        <div style={{ height: bottomBarHeight, overflow: 'hidden' }}>{bottomBarComponent}</div>
      )}
    </Div100vh>
  );
}
