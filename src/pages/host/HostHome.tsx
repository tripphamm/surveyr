import React from 'react';
import Shell from '../../components/Shell';

import useRouter from '../../hooks/useRouter';

export default function HostHome() {
  const { history } = useRouter();

  return (
    <Shell
      iconButtonLeftOnClick={() => {
        history.push('/');
      }}
    />
  );
}
