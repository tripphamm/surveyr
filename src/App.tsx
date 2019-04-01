import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes/Routes';
import ErrorHandler from './ErrorHandler';
import Loading from './pages/Loading';
import AuthenticatedSession from './AuthenticatedSession';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorHandler>
        <Suspense fallback={<Loading />}>
          <AuthenticatedSession>
            <Routes />
          </AuthenticatedSession>
        </Suspense>
      </ErrorHandler>
    </BrowserRouter>
  );
}
