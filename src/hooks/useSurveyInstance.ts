import { useState, useEffect } from 'react';

import { firestore } from '../services/firebaseService';
import ErrorCode from '../settings/ErrorCode';
import { Subscribable, SurveyInstance } from '../state/state';

export default function useSurveyInstance(shareCode?: string) {
  const [surveyInstance, setSurveyInstance] = useState<Subscribable<SurveyInstance>>({
    loading: true,
  });

  useEffect(() => {
    setSurveyInstance({
      loading: true,
    });

    if (shareCode === undefined) {
      return;
    }

    // subscribe function returns unsubscribe
    const unsubscribe = firestore
      .collection('survey-instances')
      // always uppercase code before sending because we only generate uppercase codes
      // this is a hacky "ignore-case" impelementation
      .where('shareCode', '==', shareCode.toUpperCase())
      .onSnapshot(surveyInstanceSnapshot => {
        try {
          if (surveyInstanceSnapshot.size === 0) {
            throw ErrorCode.SURVEY_INSTANCE_NOT_FOUND;
          }

          if (surveyInstanceSnapshot.size > 1) {
            // todo: log this somewhere
            throw ErrorCode.MULTIPLE_SURVEY_INSTANCES_FOUND;
          }

          const surveyInstance = surveyInstanceSnapshot.docs[0].data() as SurveyInstance;
          surveyInstance.id = surveyInstanceSnapshot.docs[0].id;

          setSurveyInstance({
            loading: false,
            errorCode: undefined,
            value: surveyInstance,
          });
        } catch (error) {
          setSurveyInstance({
            loading: false,
            errorCode: error.toString(),
            value: undefined,
          });
        }
      });

    return unsubscribe;
  }, [shareCode]);

  return surveyInstance;
}