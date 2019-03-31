import {
  Survey,
  NormalizedSurvey,
  NormalizedQuestion,
  NormalizedAnswer,
  Question,
  Answer,
} from '../entities';

export function normalizeSurvey(survey: Survey): NormalizedSurvey {
  const normalizedQuestions = survey.questions.reduce<{
    [questionId: string]: NormalizedQuestion;
  }>((questions, question, qIndex) => {
    const normalizedAnswers = question.possibleAnswers.reduce<{
      [answerId: string]: NormalizedAnswer;
    }>((answers, answer, aIndex) => {
      answers[answer.id] = {
        ...answer,
        number: aIndex,
      };
      return answers;
    }, {});

    questions[question.id] = {
      ...question,
      number: qIndex,
      possibleAnswers: normalizedAnswers,
    };

    return questions;
  }, {});

  return {
    ...survey,
    questions: normalizedQuestions,
  };
}

export function denormalizeSurvey(normalizedSurvey: NormalizedSurvey): Survey {
  const questions = Object.values(normalizedSurvey.questions)
    .sort((a, b) => a.number - b.number)
    .reduce<Question[]>((questions, normalizedQuestion) => {
      const answers = Object.values(normalizedQuestion.possibleAnswers)
        .sort((a, b) => a.number - b.number)
        .reduce<Answer[]>((answers, normalizedAnswer) => {
          // we added the `number` prop to the answer, se we remove it here
          const { number, ...answer } = normalizedAnswer;
          answers.push(answer);
          return answers;
        }, []);

      // we added the `number` prop, so we remove it here
      const { number, ...question } = normalizedQuestion;
      questions.push({
        ...question,
        possibleAnswers: answers,
      });

      return questions;
    }, []);

  // we just need to overwrite the `questions` prop on the normalizedSurvey to denormalize
  return {
    ...normalizedSurvey,
    questions,
  };
}
