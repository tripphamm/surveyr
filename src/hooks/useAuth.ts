import { useEffect, useState } from 'react';

import { auth } from '../services/firebaseService';
import { Subscribable, User, Nullable } from '../entities';
import { logError } from '../utils/errorLogger';

export default function useAuth() {
  const [user, setUser] = useState<Subscribable<Nullable<User>>>({ loading: true });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      try {
        if (user === null) {
          // user signed out
          setUser({
            loading: false,
            value: null,
            errorCode: undefined,
          });
        } else {
          // user signed in
          setUser({
            loading: false,
            errorCode: undefined,
            value: {
              id: user.uid,
              isAnonymous: user.isAnonymous,
              displayName: user.displayName,
            },
          });
        }
      } catch (error) {
        logError('useAuth', error);
        setUser({
          loading: false,
          errorCode: error.message,
          value: undefined,
        });
      }
    });

    return unsubscribe;
  }, []);

  return user;
}
