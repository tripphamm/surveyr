import { useState, useEffect, useCallback } from 'react';

import { firestore } from '../services/firebaseService';
import { NormalizedSurveys, Subscribable, Survey, UnsavedSurvey } from '../state/state';
import { normalizeSurvey } from '../utils/normalizationUtil';

export default function useMySurveys(
  userId: string,
): [
  Subscribable<NormalizedSurveys>,
  (survey: UnsavedSurvey) => Promise<void>,
  (surveyId: string) => Promise<void>
] {
  const [mySurveys, setMySurveys] = useState<Subscribable<NormalizedSurveys>>({
    loading: true,
  });

  useEffect(() => {
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
            console.error('useMySurveys', error);
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
      console.error('useMySurveys', error);
      setMySurveys({
        loading: false,
        errorCode: error.toString(),
        value: undefined,
      });
    }
  }, [userId]);

  const saveSurvey = useCallback(
    async (survey: UnsavedSurvey) => {
      try {
        const ref = firestore.collection('surveys');
        if (survey.id) {
          // this is an edit
          await ref.doc(survey.id).set(survey);
        } else {
          // this is a new survey
          survey.authorId = userId;
          await ref.add(survey);
        }
      } catch (error) {
        console.error('saveSurvey', error);
        // todo: handle this error in the UI
      }
    },
    [userId],
  );

  const deleteSurvey = async (surveyId: string) => {
    try {
      await firestore
        .collection('surveys')
        .doc(surveyId)
        .delete();
    } catch (error) {
      console.error('deleteSurvey', error);
      // todo: handle this error in the UI
    }
  };

  return [mySurveys, saveSurvey, deleteSurvey];
}
