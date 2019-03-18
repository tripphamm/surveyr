import React, { useEffect } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { auth } from './services/firebaseService';
import Routes from './Routes';
import { createSetUserSuccessAction, createSetSurveyFailureAction } from './state/actions';
import Loading from './components/Loading';
import { State } from './state/state';
import useRouter from './hooks/useRouter';
import Shell from './components/Shell';
import { Typography } from '@material-ui/core';

const mapState = (state: State) => {
  return {
    user: state.user.value,
  };
};

export default function App() {
  const dispatch = useDispatch();
  const { user } = useMappedState(mapState);

  const { location } = window;

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
        dispatch(createSetSurveyFailureAction(error.toString()));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  // if user is undefined, it means that we haven't determined whether or not the user is alraedy signed in
  // show the loader rather than flashing the sign-in screen
  if (user === undefined) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
