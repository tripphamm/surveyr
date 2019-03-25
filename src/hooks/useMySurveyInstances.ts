import { useState, useEffect, useCallback } from 'react';

import { Loadable, SurveyInstance } from '../state/state';
import { firestore } from '../services/firebaseService';
import { NormalizedSurveyInstances } from '../state/state';

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
    firestore
      .collection('survey-instances')
      .where('authorId', '==', userId)
      .onSnapshot(mySurveyInstancesSnapshot => {
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
      });
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
      setMySurveyInstances({
        ...mySurveyInstances,
        errorCode: error.toString(),
      });
    }
  };

  const deleteSurveyInstance = async (surveyInstanceId: string) => {
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
  };

  return [mySurveyInstances, { addSurveyInstance, updateSurveyInstance, deleteSurveyInstance }];
}
