import React from 'react';
import uuidv4 from 'uuid/v4';

import { UnsavedSurvey } from '../state/state';
import SurveyEditor from './SurveyEditor';
import useRouter from '../hooks/useRouter';
import { getSurveysPath } from '../utils/routeUtil';

export default function CreateSurvey(props: {
  saveSurvey: (unsavedSurvey: UnsavedSurvey) => Promise<void>;
}) {
  const { saveSurvey } = props;
  const { history } = useRouter();
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

  return (
    <SurveyEditor
      initialSurveyData={initialSurveyData}
      onSave={async (unsavedSurvey: UnsavedSurvey) => {
        await saveSurvey(unsavedSurvey);
        history.push(getSurveysPath());
      }}
    />
  );
}
