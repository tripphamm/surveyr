import { firestore } from '../services/firebaseService';
import { Survey, UnsavedSurvey } from '../entities';
import { logError } from '../utils/errorLogger';

export default function useSurveyActions(
  userId: string,
): {
  addSurvey: (newSurvey: UnsavedSurvey) => Promise<void>;
  updateSurvey: (survey: Survey) => Promise<void>;
  deleteSurvey: (surveyId: string) => Promise<void>;
} {
  const addSurvey = async (newSurvey: UnsavedSurvey) => {
    try {
      newSurvey.authorId = userId;
      await firestore.collection('surveys').add(newSurvey);
    } catch (error) {
      logError('addSurvey', error);
      // todo: handle this error in the UI
    }
  };

  const updateSurvey = async (survey: Survey) => {
    try {
      await firestore
        .collection('surveys')
        .doc(survey.id)
        .set(survey);
    } catch (error) {
      logError('updateSurvey', error);
      // todo: handle this error in the UI
    }
  };

  const deleteSurvey = async (surveyId: string) => {
    try {
      await firestore
        .collection('surveys')
        .doc(surveyId)
        .delete();
    } catch (error) {
      logError('deleteSurvey', error);
      // todo: handle this error in the UI
    }
  };

  return { addSurvey, updateSurvey, deleteSurvey };
}
