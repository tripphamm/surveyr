import React from 'react';
import ReactDOM from 'react-dom';
import rollbar from 'rollbar';

import App from './App';
import { setRollbarInstance } from './utils/errorLogger';

if (process.env.NODE_ENV === 'production') {
  const rollbarInstance = rollbar.init({
    accessToken: '4db9b76caa194b42aa3d44167bcb9d44',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: process.env.NODE_ENV,
      client: {
        javascript: {
          // helps Rollbar determine which source-maps to use
          // eslint-disable-next-line @typescript-eslint/camelcase
          code_version: process.env.REACT_APP_VERSION || 'development',
        },
      },
    },
  });

  setRollbarInstance(rollbarInstance);
}

ReactDOM.render(<App />, document.getElementById('root'));
