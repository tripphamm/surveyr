import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { auth } from './services/firebaseService';
import Routes from './Routes';
import { createSetUserSuccessAction, createSetActiveSurveyFailureAction } from './state/actions';
import Loading from './components/Loading';
import { State } from './state/state';

const mapState = (state: State) => {
  return {
    user: state.user.value,
  };
};

export default function App() {
  const dispatch = useDispatch();
  const { user } = useMappedState(mapState);

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
        dispatch(createSetActiveSurveyFailureAction(error.toString()));
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
