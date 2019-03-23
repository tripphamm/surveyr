import { useState, useEffect } from 'react';

import { firestore } from '../services/firebaseService';
import ErrorCode from '../settings/ErrorCode';
import {
  Survey,
  NormalizedSurvey,
  NormalizedQuestion,
  NormalizedAnswer,
  Subscribable,
} from '../state/state';
import { normalizeSurvey } from '../utils/normalizationUtil';

export default function useSurvey(surveyId?: string) {
  const [survey, setSurvey] = useState<Subscribable<NormalizedSurvey>>({
    loading: true,
  });

  useEffect(() => {
    setSurvey({
      loading: true,
    });

    if (surveyId === undefined) {
      return;
    }

    const unsubscribe = firestore
      .collection('surveys')
      .doc(surveyId)
      .onSnapshot(surveySnapshot => {
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
      });

    return unsubscribe;
  }, [surveyId]);

  return survey;
}
