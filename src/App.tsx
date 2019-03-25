import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { auth } from './services/firebaseService';
import Routes from './routes/Routes';
import { createSetUserSuccessAction, createSetUserFailureAction } from './state/actions';
import Loading from './pages/Loading';
import { State } from './state/state';

export default function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
