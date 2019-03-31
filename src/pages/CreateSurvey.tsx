import React from 'react';
import uuidv4 from 'uuid/v4';

import { UnsavedSurvey } from '../entities';
import SurveyEditor from './SurveyEditor';
import useRouter from '../hooks/useRouter';
import { getSurveysPath } from '../utils/routeUtil';

export default function CreateSurvey(props: {
  addSurvey: (newSurvey: UnsavedSurvey) => Promise<void>;
}) {
  const { addSurvey } = props;
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
      onSave={async (newSurvey: UnsavedSurvey) => {
        await addSurvey(newSurvey);
        history.push(getSurveysPath());
      }}
    />
  );
}
