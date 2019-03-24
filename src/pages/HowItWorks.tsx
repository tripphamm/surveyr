import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Shell from '../components/Shell';
import HowItWorksSteps from '../components/HowItWorksSteps';

import useRouter from '../hooks/useRouter';

export default function HowItWorks() {
  const { history } = useRouter();

  return (
    <Shell
      bottomBarComponent={
        <Button
          style={{ height: '100%', width: '100%' }}
          variant="contained"
          color="primary"
          onClick={() => {
            history.push('/');
          }}
        >
          Sounds good
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
        <Typography variant="display1" style={{ textAlign: 'center' }}>
          {"Here's how it works"}
        </Typography>

        <HowItWorksSteps />
      </div>
    </Shell>
  );
}
