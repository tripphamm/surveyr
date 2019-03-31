import React, { useEffect, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'redux-react-hook';

import { auth } from './services/firebaseService';
import Routes from './routes/Routes';
import { createSetUserSuccessAction, createSetUserFailureAction } from './state/actions';
import ErrorHandler from './ErrorHandler';
import Loading from './pages/Loading';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      try {
        if (user === null) {
          // user signed out
          dispatch(createSetUserSuccessAction(null));
        } else {
          // user signed in
          dispatch(
            createSetUserSuccessAction({
              id: user.uid,
              isAnonymous: user.isAnonymous,
              displayName: user.displayName,
            }),
          );
        }
      } catch (error) {
        console.error('setUser', error);
        dispatch(createSetUserFailureAction(error.toString()));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ErrorHandler>
        <Suspense fallback={<Loading />}>
          <Routes />
        </Suspense>
      </ErrorHandler>
    </BrowserRouter>
  );
}
