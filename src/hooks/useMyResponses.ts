import { useState, useEffect, useCallback } from 'react';

import { firestore } from '../services/firebaseService';
import {
  Subscribable,
  MySurveyResponsesByQuestionId,
  UnsavedSurveyResponse,
  SurveyResponse,
} from '../state/state';

export default function useMyResponses(
  userId: string,
  surveyInstanceId: string,
): [
  Subscribable<MySurveyResponsesByQuestionId>,
  (surveyResponse: UnsavedSurveyResponse) => Promise<void>
] {
  const [myResponses, setmyResponses] = useState<Subscribable<MySurveyResponsesByQuestionId>>({
    loading: true,
  });

  useEffect(() => {
    setmyResponses({
      loading: true,
    });

    try {
      // subscribe function returns unsubscribe
      const unsubscribe = firestore
        .collection('survey-responses')
        .doc(surveyInstanceId)
        .collection('answers')
        .where('userId', '==', userId)
        .onSnapshot(mySurveyResponsesSnapshot => {
          try {
            const normalizedResponses = mySurveyResponsesSnapshot.docs.reduce<
              MySurveyResponsesByQuestionId
            >((mySurveyResponses, surveyResponseDoc) => {
              const surveyResponse = surveyResponseDoc.data() as SurveyResponse;
              surveyResponse.id = surveyResponseDoc.id;
              mySurveyResponses[surveyResponse.questionId] = surveyResponse;

              return mySurveyResponses;
            }, {});

            setmyResponses({
              loading: false,
              errorCode: undefined,
              value: normalizedResponses,
            });
          } catch (error) {
            console.error('useMyResponses', error);
            setmyResponses({
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
      console.error('useMyResponses', error);
      setmyResponses({
        loading: false,
        errorCode: error.toString(),
        value: undefined,
      });
    }
  }, [userId, surveyInstanceId]);

  const submitAnswer = useCallback(
    async (surveyResponse: UnsavedSurveyResponse) => {
      const ref = firestore
        .collection('survey-responses')
        .doc(surveyInstanceId)
        .collection('answers');

      if (surveyResponse.id) {
        // this is an edit

        // we added an id prop to the surveyResponse, so we remove it here
        const { id, ...persistableResponse } = surveyResponse;
        await ref.doc(surveyResponse.id).set(persistableResponse);
      } else {
        // this is a new survey
        surveyResponse.userId = userId;
        await ref.add(surveyResponse);
      }
    },
    [userId, surveyInstanceId],
  );

  return [myResponses, submitAnswer];
}
