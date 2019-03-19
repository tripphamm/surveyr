import * as React from 'react';
import Fab, { FabProps } from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import {
  floatingActionButtonSize,
  floatingActionButtonOffsetBottom,
  floatingActionButtonOffsetRight,
} from '../settings/magicNumbers';

export default function FloatingAddButton(props: FabProps) {
  return (
    <>
      <Fab
        {...props}
        color="secondary"
        style={{
          position: 'fixed',
          bottom: floatingActionButtonOffsetBottom,
          right: floatingActionButtonOffsetRight,
          height: floatingActionButtonSize,
          width: floatingActionButtonSize,
        }}
      >
        <AddIcon />
      </Fab>
      <div style={{ height: floatingActionButtonSize + 10 }} />
    </>
  );
}
