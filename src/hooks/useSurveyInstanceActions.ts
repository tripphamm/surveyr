import { logError } from '../utils/errorLogger';
import { SurveyInstance } from '../entities';
import { firestore } from '../services/firebaseService';

export default function useSurveyInstanceActions(
  userId: string,
): {
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
} {
  const addSurveyInstance = async (
    surveyId: string,
    initialQuestionId: string,
    shareCode: string,
  ) => {
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
      logError('addSurveyInstance', error);
    }
  };

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
      logError('updateSurveyInstance', error);
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

  return { addSurveyInstance, updateSurveyInstance, deleteSurveyInstance };
}
