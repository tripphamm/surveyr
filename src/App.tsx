import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes/Routes';
import ErrorHandler from './ErrorHandler';
import Loading from './pages/Loading';
import useAuth from './hooks/useAuth';
import SessionContext from './SessionContext';
import useMySurveys from './hooks/useMySurveys';
import useMySurveyInstances from './hooks/useMySurveyInstances';

export default function App() {
  const user = useAuth();

  let userId;
  if (user.value === null || user.value === undefined) {
    userId = undefined;
  } else {
    userId = user.value.id;
  }

  const surveys = useMySurveys(userId);
  const surveyInstances = useMySurveyInstances(userId);

  const sessionContext = {
    user,
    surveys,
    surveyInstances,
  };

  return (
    <BrowserRouter>
      <ErrorHandler>
        <Suspense fallback={<Loading />}>
          <SessionContext.Provider value={sessionContext}>
            <Routes />
          </SessionContext.Provider>
        </Suspense>
      </ErrorHandler>
    </BrowserRouter>
  );
}
