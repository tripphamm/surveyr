import { useState, useEffect, useCallback } from 'react';
import uuidv4 from 'uuid/v4';

import { Loadable, SurveyInstance, Subscribable } from '../state/state';
import { firestore } from '../services/firebaseService';
import useSurveyInstance from './useSurveyInstance';

export default function useHostedSurveyInstance(
  userId: string,
  surveyId: string,
  firstQuestionId: string,
): [
  Subscribable<SurveyInstance>,
  (surveyInstanceUpdate: Partial<SurveyInstance>) => Promise<void>
] {
  const [createHostedSurveyResult, setCreatedHostedSurveyResult] = useState<
    Loadable<{ shareCode: string; ref: firebase.firestore.DocumentReference }>
  >({ loading: true });

  useEffect(() => {
    const shareCode = uuidv4()
      .slice(0, 4)
      .toUpperCase();

    firestore
      .collection('survey-instances')
      .add({
        authorId: userId,
        surveyId: surveyId,
        currentQuestionId: firstQuestionId,
        acceptAnswers: true,
        showResults: true,
        shareCode,
      })
      .then(hostedSurveyDocRef => {
        setCreatedHostedSurveyResult({
          loading: false,
          errorCode: undefined,
          value: {
            shareCode,
            ref: hostedSurveyDocRef,
          },
        });
      })
      .catch(error => {
        setCreatedHostedSurveyResult({
          loading: false,
          errorCode: error.toString(),
          value: undefined,
        });
      });
  }, [userId, surveyId, firstQuestionId]);

  const hostedSurvey = useSurveyInstance(
    createHostedSurveyResult.value ? createHostedSurveyResult.value.shareCode : undefined,
  );

  const updateHostedSurvey = useCallback(
    async (surveyInstanceUpdate: Partial<SurveyInstance>) => {
      if (hostedSurvey.value === undefined) {
        return;
      }

      await firestore
        .collection('survey-instances')
        .doc(hostedSurvey.value.id)
        .update(surveyInstanceUpdate);
    },
    [hostedSurvey.value],
  );

  return [
    {
      loading: createHostedSurveyResult.loading || hostedSurvey.loading,
      errorCode: createHostedSurveyResult.errorCode || hostedSurvey.errorCode || undefined,
      value: hostedSurvey.value,
    },
    updateHostedSurvey,
  ];
}
