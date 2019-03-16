import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Div100vh from 'react-div-100vh';

import { topBarHeight, bottomBarHeight } from '../settings/magicNumbers';

type ShellProps = React.HTMLProps<HTMLDivElement> & {
  title?: string;
  iconElementLeft?: React.ReactNode;
  onLeftIconButtonClick?: () => void;
  iconElementRight?: React.ReactNode;
  onRightIconButtonClick?: () => void;
  bottomBarComponent?: React.ReactNode;
};

export default function Shell(props: ShellProps) {
  const {
    title = 'Surveyr',
    iconElementLeft,
    onLeftIconButtonClick,
    iconElementRight,
    onRightIconButtonClick,
    bottomBarComponent,
    children,
  } = props;

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
          <IconButton color="inherit" onClick={onLeftIconButtonClick}>
            {iconElementLeft}
          </IconButton>
          {/* flexGrow is required to push the right IconButton to the right side */}
          <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton color="inherit" onClick={onRightIconButtonClick}>
            {iconElementRight}
          </IconButton>
        </Toolbar>
      </AppBar>
      <div
        style={{
          boxSizing: 'border-box',
          // set the size of the viewport (between the app bar and bottom nav)
          height: `calc(100% - ${topBarHeight + bottomBarHeight}px)`,
          overflow: 'auto',
          padding: 20,
        }}
      >
        {children}
      </div>
      <div style={{ height: bottomBarHeight, overflow: 'hidden' }}>{bottomBarComponent}</div>
    </Div100vh>
  );
}
