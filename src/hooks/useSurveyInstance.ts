import { useState, useEffect } from 'react';

import { firestore } from '../services/firebaseService';
import ErrorCode from '../settings/ErrorCode';
import { Subscribable, SurveyInstance } from '../entities';
import { logError } from '../utils/errorLogger';

export default function useSurveyInstance(shareCode?: string) {
  const [surveyInstance, setSurveyInstance] = useState<Subscribable<SurveyInstance>>({
    loading: true,
  });

  useEffect(() => {
    setSurveyInstance({
      loading: true,
    });

    // todo, I don't like handling this here. Components should just throw if they don't have the surveyId
    if (shareCode === undefined) {
      return;
    }

    try {
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
            logError('useSurveyInstance', error);
            setSurveyInstance({
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
      logError('useSurveyInstance', error);
      setSurveyInstance({
        loading: false,
        errorCode: error.toString(),
        value: undefined,
      });
    }
  }, [shareCode]);

  return surveyInstance;
}
