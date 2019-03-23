import React from 'react';
import uuidv4 from 'uuid/v4';
import { RouteComponentProps } from 'react-router-dom';

import { UnsavedSurvey } from '../state/state';
import SurveyEditor from './SurveyEditor';

export default function CreateSurvey(
  props: RouteComponentProps & {
    saveSurvey: (unsavedSurvey: UnsavedSurvey) => Promise<void>;
  },
) {
  const { saveSurvey } = props;

  const initialSurveyData: UnsavedSurvey = {
    title: '',
    questions: [
      {
        id: uuidv4(),
        value: '',
        possibleAnswers: [{ id: uuidv4(), value: '' }],
      },
    ],
  };

  return <SurveyEditor initialSurveyData={initialSurveyData} saveSurvey={saveSurvey} />;
}
