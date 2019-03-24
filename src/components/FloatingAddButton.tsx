import * as React from 'react';
import Fab, { FabProps } from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';

import {
  floatingActionButtonSize,
  floatingActionButtonOffsetBottom,
  floatingActionButtonOffsetRight,
  floatingActionButtonBufferSize,
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
        <Add />
      </Fab>
      <div style={{ height: floatingActionButtonBufferSize }} />
    </>
  );
}
