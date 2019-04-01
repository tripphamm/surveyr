import { useState, useEffect } from 'react';

import { SurveyInstance, NormalizedSurveyInstances, Subscribable } from '../entities';
import { firestore } from '../services/firebaseService';
import { logError } from '../utils/errorLogger';

export default function useMySurveyInstances(
  userId: string,
): Subscribable<NormalizedSurveyInstances> {
  const [mySurveyInstances, setMySurveyInstances] = useState<
    Subscribable<NormalizedSurveyInstances>
  >({
    loading: true,
  });

  useEffect(() => {
    // todo: should this go before or after the bail-out
    setMySurveyInstances({
      loading: true,
    });

    try {
      const unsubscribe = firestore
        .collection('survey-instances')
        .where('authorId', '==', userId)
        .onSnapshot(mySurveyInstancesSnapshot => {
          try {
            const surveyInstances = mySurveyInstancesSnapshot.docs.map(doc => {
              const surveyInstance = doc.data() as SurveyInstance;
              surveyInstance.id = doc.id;
              return surveyInstance;
            });

            const normalizedSurveyInstances = surveyInstances.reduce<NormalizedSurveyInstances>(
              (acc, surveyInstance) => {
                acc[surveyInstance.shareCode] = surveyInstance;
                return acc;
              },
              {},
            );

            setMySurveyInstances({
              loading: false,
              errorCode: undefined,
              value: normalizedSurveyInstances,
            });
          } catch (error) {
            logError('useMySurveyInstances', error);
            setMySurveyInstances({
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
      logError('useMySurveyInstances', error);
      setMySurveyInstances({
        loading: false,
        errorCode: error.toString(),
        value: undefined,
      });
    }
  }, [userId]);

  return mySurveyInstances;
}
