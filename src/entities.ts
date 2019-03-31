type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface Loadable<T> {
  loading: boolean;
  errorCode?: string;
  value?: T;
}

export interface Subscribable<T> {
  loading: boolean;
  errorCode?: string;
  value?: T;
}

export type Nullable<T> = T | null;

export interface SurveyInstance {
  id: string;
  authorId: string;
  shareCode: string;
  surveyId: string;
  currentQuestionId: string;
  acceptAnswers: boolean;
  showResults: boolean;
}

export interface NormalizedSurveyInstances {
  [shareCode: string]: SurveyInstance;
}

export interface User {
  id: string;
  isAnonymous: boolean;
  displayName: string | null;
}

export interface Answer {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  value: string;
  possibleAnswers: Answer[];
}

export interface Survey {
  id: string;
  authorId: string;
  title: string;
  questions: Question[];
}

export interface UnsavedSurvey {
  id?: string;
  authorId?: string;
  title: string;
  questions: Question[];
}

export interface NormalizedAnswer {
  id: string;
  number: number;
  value: string;
}

export interface NormalizedQuestion {
  id: string;
  number: number;
  value: string;
  possibleAnswers: { [answerId: string]: NormalizedAnswer };
}

export interface NormalizedSurvey {
  id: string;
  authorId: string;
  title: string;
  questions: { [questionId: string]: NormalizedQuestion };
}

export interface MySurveyResponsesByQuestionId {
  [questionId: string]: SurveyResponse;
}

export interface SurveyResponse {
  id: string;
  userId: string;
  questionId: string;
  answerId: string;
}

export interface UnsavedSurveyResponse {
  id?: string;
  userId?: string;
  questionId: string;
  answerId: string;
}

export interface SurveyResponsesByQuestionId {
  [questionId: string]: SurveyResponse[];
}

export interface NormalizedSurveys {
  [surveyId: string]: NormalizedSurvey;
}
