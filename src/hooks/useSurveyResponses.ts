import { useState, useEffect } from 'react';

import { firestore } from '../services/firebaseService';
import { Subscribable, SurveyResponsesByQuestionId, SurveyResponse } from '../state/state';

export default function useSurveyResponses(surveyInstanceId?: string) {
  const [surveyResponses, setsurveyResponses] = useState<Subscribable<SurveyResponsesByQuestionId>>(
    {
      loading: true,
    },
  );

  useEffect(() => {
    setsurveyResponses({
      loading: true,
    });

    if (surveyInstanceId === undefined) {
      return;
    }

    // subscribe function returns unsubscribe
    const unsubscribe = firestore
      .collection('survey-responses')
      .doc(surveyInstanceId)
      .collection('answers')
      .onSnapshot(participantAnswersSnapshot => {
        try {
          const answerDocs = participantAnswersSnapshot.docs;

          const normalizedResponses = answerDocs.reduce<SurveyResponsesByQuestionId>(
            (surveyResponses, surveyResponseDoc) => {
              const surveyResponse = surveyResponseDoc.data() as SurveyResponse;
              if (surveyResponses[surveyResponse.questionId] === undefined) {
                surveyResponses[surveyResponse.questionId] = [];
              }

              surveyResponses[surveyResponse.questionId].push(surveyResponse);

              return surveyResponses;
            },
            {},
          );

          setsurveyResponses({
            loading: false,
            errorCode: undefined,
            value: normalizedResponses,
          });
        } catch (error) {
          setsurveyResponses({
            loading: false,
            errorCode: error.toString(),
            value: undefined,
          });
        }
      });

    return unsubscribe;
  }, [surveyInstanceId]);

  return surveyResponses;
}
