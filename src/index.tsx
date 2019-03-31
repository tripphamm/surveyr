import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from 'redux-react-hook';
import rollbar from 'rollbar';

import App from './App';
import { getStore } from './state/store';

rollbar.init({
  accessToken: '4db9b76caa194b42aa3d44167bcb9d44',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV,
  },
});

ReactDOM.render(
  <StoreContext.Provider value={getStore()}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root'),
);
