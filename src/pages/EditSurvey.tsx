import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import useRouter from '../hooks/useRouter';
import { UnsavedSurvey, NormalizedSurveys } from '../state/state';
import SurveyEditor from './SurveyEditor';
import NotFound from './NotFound';
import { denormalizeSurvey } from '../utils/normalizationUtil';
import { getSurveyPath } from '../utils/routeUtil';

export default function EditSurvey(
  props: RouteComponentProps & {
    surveys: NormalizedSurveys;
    saveSurvey: (unsavedSurvey: UnsavedSurvey) => Promise<void>;
  },
) {
  const { surveys, saveSurvey } = props;

  const { match, history } = useRouter<{ surveyId: string }>();
  const { params } = match;
  const { surveyId } = params;

  const survey = surveys[surveyId];

  if (survey === undefined) {
    return <NotFound />;
  }

  const initialSurveyData: UnsavedSurvey = denormalizeSurvey(survey);

  return (
    <SurveyEditor
      initialSurveyData={initialSurveyData}
      onSave={async (unsavedSurvey: UnsavedSurvey) => {
        await saveSurvey(unsavedSurvey);
        history.push(getSurveyPath(surveyId));
      }}
    />
  );
}
