import React from 'react';
import { Redirect } from 'react-router-dom';

import useRouter from '../hooks/useRouter';
import SurveyEditor from './SurveyEditor';
import { denormalizeSurvey } from '../utils/normalizationUtil';
import { getSurveyPath, getSurveysPath } from '../utils/routeUtil';
import { Survey, NormalizedSurveys, UnsavedSurvey } from '../entities';

export default function EditSurvey(props: {
  surveys: NormalizedSurveys;
  updateSurvey: (survey: Survey) => Promise<void>;
  deleteSurvey: (surveyId: string) => Promise<void>;
}) {
  const { surveys, updateSurvey, deleteSurvey } = props;

  const { match, history } = useRouter<{ surveyId: string }>();
  const { params } = match;
  const { surveyId } = params;

  const survey = surveys[surveyId];

  if (survey === undefined) {
    return <Redirect to={getSurveysPath()} />;
  }

  const initialSurveyData: Survey = denormalizeSurvey(survey);

  return (
    <SurveyEditor
      initialSurveyData={initialSurveyData}
      onSave={async (survey: UnsavedSurvey) => {
        // this will actually be a full-blown survey, not an unsaved survey
        // but Typescript gets mad if this fn tries to accept a Survey type
        await updateSurvey(survey as Survey);
        history.push(getSurveyPath(surveyId));
      }}
      onDelete={async (surveyId: string) => {
        await deleteSurvey(surveyId);
      }}
    />
  );
}
