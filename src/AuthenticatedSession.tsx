import React, { useState, useEffect } from 'react';

import useAuth from './hooks/useAuth';
import UserContext from './UserContext';
import { User } from './entities';
import { auth } from './services/firebaseService';
import Loading from './pages/Loading';

enum UserAuthState {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_IN_ANONOMOUSLY = 'SIGNED_IN_ANONOMOUSLY',
  SIGNED_OUT = 'SIGNED_OUT',
  UNKNOWN = 'UNKNOWN',
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

export default function AuthenticatedSession(props: { children: React.ReactNode }) {
  const { children } = props;
  const [authenticatingAnonymously, setAuthenticatingAnonymously] = useState(false);

  const user = useAuth();

  const userAuthState = getUserAuthState(user.value);

  // if user is signed in, toggle the authenticating flag off
  if (
    authenticatingAnonymously &&
    (userAuthState === UserAuthState.SIGNED_IN ||
      userAuthState === UserAuthState.SIGNED_IN_ANONOMOUSLY)
  ) {
    setAuthenticatingAnonymously(false);
  }

  // if we're signed out, sign in anonymously
  useEffect(() => {
    if (userAuthState === UserAuthState.SIGNED_OUT && !authenticatingAnonymously) {
      auth.signInAnonymously();
      setAuthenticatingAnonymously(true);
    }
  }, [userAuthState, authenticatingAnonymously]);

  if (
    userAuthState !== UserAuthState.SIGNED_IN &&
    userAuthState !== UserAuthState.SIGNED_IN_ANONOMOUSLY
  ) {
    return <Loading />;
  }

  return <UserContext.Provider value={{ user: user.value! }}>{children}</UserContext.Provider>;
}
