import { useContext } from 'react';

import SessionContext from '../SessionContext';

export default function() {
  const { user, surveys, surveyInstances } = useContext(SessionContext);

  return {
    ready: user.value !== undefined && surveys.value !== undefined && surveyInstances !== undefined,
    user: user.value,
    surveys: surveys.value,
    surveyInstances: surveyInstances.value,
  };
}
