import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';

import useRouter from '../hooks/useRouter';
import { UnsavedSurvey, NormalizedSurveys } from '../state/state';
import SurveyEditor from './SurveyEditor';
import NotFound from './NotFound';
import { denormalizeSurvey } from '../utils/normalizationUtil';
import { getSurveyPath, getSurveysPath } from '../utils/routeUtil';

export default function EditSurvey(
  props: RouteComponentProps & {
    surveys: NormalizedSurveys;
    saveSurvey: (unsavedSurvey: UnsavedSurvey) => Promise<void>;
    deleteSurvey: (surveyId: string) => Promise<void>;
  },
) {
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
  );
}
