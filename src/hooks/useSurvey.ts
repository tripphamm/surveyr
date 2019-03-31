import { useState, useEffect } from 'react';

import { firestore } from '../services/firebaseService';
import ErrorCode from '../settings/ErrorCode';
import { Survey, NormalizedSurvey, Subscribable } from '../entities';
import { normalizeSurvey } from '../utils/normalizationUtil';
import { logError } from '../utils/errorLogger';

export default function useSurvey(surveyId?: string) {
  const [survey, setSurvey] = useState<Subscribable<NormalizedSurvey>>({
    loading: true,
  });

  useEffect(() => {
    setSurvey({
      loading: true,
    });

    // todo, I don't like handling this here. Components should just throw if they don't have the surveyId
    if (surveyId === undefined) {
      return;
    }

    try {
      const unsubscribe = firestore
        .collection('surveys')
        .doc(surveyId)
        .onSnapshot(surveySnapshot => {
          try {
            if (!surveySnapshot.exists) {
              throw ErrorCode.SURVEY_DOES_NOT_EXIST;
            }

            const survey = surveySnapshot.data() as Survey;
            survey.id = surveySnapshot.id;

            const normalizedSurvey = normalizeSurvey(survey);

            setSurvey({
              loading: false,
              value: normalizedSurvey,
              errorCode: undefined,
            });
          } catch (error) {
            logError('useSurvey', error);
            setSurvey({
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
      logError('useSurvey', error);
      setSurvey({
        loading: false,
        errorCode: error.toString(),
        value: undefined,
      });
    }
  }, [surveyId]);

  return survey;
}
