import { useContext } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import * as H from 'history';

const RouterContext = require('react-router').__RouterContext;

// hack: use official API when https://github.com/ReactTraining/react-router/pull/6453 merged

export default function useRouter<
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext,
  S = H.LocationState
>(): RouteComponentProps<Params, C, S> {
  return useContext(RouterContext) as RouteComponentProps<Params, C, S>;
}
