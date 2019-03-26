import React from 'react';
import { Redirect } from 'react-router-dom';

import useRouter from '../hooks/useRouter';
import { UnsavedSurvey, NormalizedSurveys } from '../state/state';
import SurveyEditor from './SurveyEditor';
import { denormalizeSurvey } from '../utils/normalizationUtil';
import { getSurveyPath, getSurveysPath } from '../utils/routeUtil';
import UserGate from '../UserGate';

export default function EditSurvey(props: {
  surveys: NormalizedSurveys;
  saveSurvey: (unsavedSurvey: UnsavedSurvey) => Promise<void>;
  deleteSurvey: (surveyId: string) => Promise<void>;
}) {
  const { surveys, saveSurvey, deleteSurvey } = props;

  const { match, history } = useRouter<{ surveyId: string }>();
  const { params } = match;
  const { surveyId } = params;

  const survey = surveys[surveyId];

  if (survey === undefined) {
    return <Redirect to={getSurveysPath()} />;
  }

  const initialSurveyData: UnsavedSurvey = denormalizeSurvey(survey);

  return (
    <UserGate>
      <SurveyEditor
        initialSurveyData={initialSurveyData}
        onSave={async (unsavedSurvey: UnsavedSurvey) => {
          await saveSurvey(unsavedSurvey);
          history.push(getSurveyPath(surveyId));
        }}
        onDelete={async (surveyId: string) => {
          await deleteSurvey(surveyId);
        }}
      />
    </UserGate>
  );
}
