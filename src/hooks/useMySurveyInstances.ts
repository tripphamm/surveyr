import { useState, useEffect, useCallback } from 'react';

import { Loadable, SurveyInstance } from '../state/state';
import { firestore } from '../services/firebaseService';
import { NormalizedSurveyInstances } from '../state/state';
import { logError } from '../utils/errorLogger';

export default function useMySurveyInstances(
  userId: string,
): [
  Loadable<NormalizedSurveyInstances>,
  {
    addSurveyInstance: (
      surveyId: string,
      initialQuestionId: string,
      shareCode: string,
    ) => Promise<void>;
    updateSurveyInstance: (
      surveyInstanceId: string,
      surveyInstanceUpdate: Partial<SurveyInstance>,
    ) => Promise<void>;
    deleteSurveyInstance: (surveyInstanceId: string) => Promise<void>;
  }
] {
  const [mySurveyInstances, setMySurveyInstances] = useState<Loadable<NormalizedSurveyInstances>>({
    loading: true,
  });

  useEffect(() => {
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

            throw new Error('TEST Error');

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

  const addSurveyInstance = useCallback(
    async (surveyId: string, initialQuestionId: string, shareCode: string) => {
      try {
        await firestore.collection('survey-instances').add({
          authorId: userId,
          surveyId: surveyId,
          currentQuestionId: initialQuestionId,
          acceptAnswers: true,
          showResults: true,
          shareCode,
        });
      } catch (error) {
        logError('addSurveyInstances', error);
        setMySurveyInstances({
          ...mySurveyInstances,
          errorCode: error.toString(),
        });
      }
    },
    [mySurveyInstances, userId],
  );

  const updateSurveyInstance = async (
    surveyInstanceId: string,
    surveyInstanceUpdate: Partial<SurveyInstance>,
  ) => {
    try {
      await firestore
        .collection('survey-instances')
        .doc(surveyInstanceId)
        .update(surveyInstanceUpdate);
    } catch (error) {
      logError('updateSurveyInstances', error);
      setMySurveyInstances({
        ...mySurveyInstances,
        errorCode: error.toString(),
      });
    }
  };

  const deleteSurveyInstance = async (surveyInstanceId: string) => {
    try {
      const batch = firestore.batch();

      const surveyInstanceDocRef = firestore.collection('survey-instances').doc(surveyInstanceId);

      batch.delete(surveyInstanceDocRef);

      const surveyResponsesSnapshot = await firestore
        .collection('survey-responses')
        .doc(surveyInstanceId)
        .collection('answers')
        .get();

      surveyResponsesSnapshot.docs.forEach(surveyResponseDoc => {
        batch.delete(surveyResponseDoc.ref);
      });

      batch.commit();
    } catch (error) {
      logError('deleteSurveyInstances', error);
      // todo: handle this error in the UI?
    }
  };

  return [mySurveyInstances, { addSurveyInstance, updateSurveyInstance, deleteSurveyInstance }];
}
