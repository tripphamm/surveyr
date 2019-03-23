import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../pages/Home';
import TOS from '../pages/TOS';
import Privacy from '../pages/Privacy';
import NotFound from '../pages/NotFound';
import FullAuthRoutes from './FullAuthRoutes';
import AnonymousAuthRoutes from './AnonymousAuthRoutes';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/u" component={FullAuthRoutes} />
      <Route path="/a" component={AnonymousAuthRoutes} />
      <Route path="/tos" component={TOS} />
      <Route path="/privacy" component={Privacy} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
