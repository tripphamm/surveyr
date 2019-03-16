import React from 'react';
import { Typography, Button } from '@material-ui/core';

export default function HostOrParticipant() {
  return (
    <div>
      <Typography>Are you hosting or participating?</Typography>
      <Button>Host</Button>
      <Button>Participant</Button>
    </div>
  );
}
