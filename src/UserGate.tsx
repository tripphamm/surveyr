import React from 'react';

import useUser from './hooks/useUser';

const Auth = React.lazy(() => import('./pages/Auth'));

export default function UserGate(props: { children: React.ReactNode }) {
  const { user } = useUser();

  const { children } = props;

  if (user.isAnonymous) {
    return <Auth />;
  }

  return <>{children}</>;
}
