import * as React from 'react';
import Fab, { FabProps } from '@material-ui/core/Fab';
import Edit from '@material-ui/icons/Edit';

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
        <Edit />
      </Fab>
      <div style={{ height: floatingActionButtonSize + 10 }} />
    </>
  );
}
