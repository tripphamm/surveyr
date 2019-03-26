import React, { useEffect, useState, Suspense } from 'react';
import { useMappedState } from 'redux-react-hook';

import { State, User } from './state/state';
import { auth } from './services/firebaseService';
import Loading from './pages/Loading';

const Auth = React.lazy(() => import('./pages/Auth'));

enum UserAuthState {
  SIGNED_IN,
  SIGNED_IN_ANONOMOUSLY,
  SIGNED_OUT,
  UNKNOWN,
}

const getUserAuthState = (user: User | null | undefined) => {
  if (user) {
    return user.isAnonymous ? UserAuthState.SIGNED_IN_ANONOMOUSLY : UserAuthState.SIGNED_IN;
  }

  if (user === null) {
    return UserAuthState.SIGNED_OUT;
  }

  return UserAuthState.UNKNOWN;
};

const mapState = (state: State) => {
  return {
    user: state.user.value,
  };
};

export default function UserGate(props: { allowAnonymous?: boolean; children: React.ReactNode }) {
  const [authenticatingAnonymously, setAuthenticatingAnonymously] = useState(false);
  const { allowAnonymous = false, children } = props;

  const { user } = useMappedState(mapState);

  const userAuthState = getUserAuthState(user);

  // if user is signed in, toggle the authenticating flag off
  if (
    authenticatingAnonymously &&
    (userAuthState === UserAuthState.SIGNED_IN ||
      userAuthState === UserAuthState.SIGNED_IN_ANONOMOUSLY)
  ) {
    setAuthenticatingAnonymously(false);
  }

  // if we're signed out, but anonymous users are okay, sign in anonymously
  useEffect(() => {
    if (
      userAuthState === UserAuthState.SIGNED_OUT &&
      allowAnonymous &&
      !authenticatingAnonymously
    ) {
      auth.signInAnonymously();
      setAuthenticatingAnonymously(true);
    }
  }, [userAuthState, allowAnonymous, authenticatingAnonymously]);

  // if we're signed in anonymously, but anonymous users are not okay, sign out
  useEffect(() => {
    if (userAuthState === UserAuthState.SIGNED_IN_ANONOMOUSLY && !allowAnonymous) {
      auth.signOut();
    }
  }, [userAuthState, allowAnonymous]);

  // if user is undefined, it means that we haven't determined whether or not the user is alraedy signed in
  // show the loader rather than flashing the sign-in screen
  if (userAuthState === UserAuthState.UNKNOWN) {
    return <Loading />;
  }

  if (authenticatingAnonymously) {
    return <Loading />;
  }

  if (userAuthState === UserAuthState.SIGNED_OUT && !allowAnonymous) {
    return (
      <Suspense fallback={<Loading />}>
        <Auth />
      </Suspense>
    );
  }

  return <>{children}</>;
}
