import { createContext } from 'react';
import {
  Subscribable,
  User,
  NormalizedSurveys,
  NormalizedSurveyInstances,
  Nullable,
} from './entities';

export interface SessionContext {
  user: Subscribable<Nullable<User>>;
  surveys: Subscribable<NormalizedSurveys>;
  surveyInstances: Subscribable<NormalizedSurveyInstances>;
}

export default createContext<SessionContext>({
  user: { loading: true },
  surveys: { loading: true },
  surveyInstances: { loading: true },
});
