import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from 'redux-react-hook';

import App from './App';
import { getStore } from './state/store';

ReactDOM.render(
  <StoreContext.Provider value={getStore()}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root'),
);
