import { useState, useEffect } from 'react';

import { firestore } from '../services/firebaseService';
import { NormalizedSurveys, Subscribable, Survey } from '../entities';
import { normalizeSurvey } from '../utils/normalizationUtil';
import { logError } from '../utils/errorLogger';

export default function useMySurveys(userId?: string): Subscribable<NormalizedSurveys> {
  const [mySurveys, setMySurveys] = useState<Subscribable<NormalizedSurveys>>({
    loading: true,
  });

  useEffect(() => {
    if (userId === undefined) {
      return;
    }

    setMySurveys({
      loading: true,
    });

    try {
      // subscribe function returns unsubscribe
      const unsubscribe = firestore
        .collection('surveys')
        .where('authorId', '==', userId)
        .onSnapshot(surveysSnapshot => {
          try {
            const mySurveys = surveysSnapshot.docs.reduce<NormalizedSurveys>(
              (surveys, surveyDoc) => {
                const survey = surveyDoc.data() as Survey;
                survey.id = surveyDoc.id;
                surveys[surveyDoc.id] = normalizeSurvey(survey);
                return surveys;
              },
              {},
            );

            setMySurveys({
              loading: false,
              errorCode: undefined,
              value: mySurveys,
            });
          } catch (error) {
            logError('useMySurveys', error);
            setMySurveys({
              loading: false,
              errorCode: error.toString(),
              value: undefined,
            });
          }
        });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      logError('useMySurveys', error);
      setMySurveys({
        loading: false,
        errorCode: error.toString(),
        value: undefined,
      });
    }
  }, [userId]);

  return mySurveys;
}
