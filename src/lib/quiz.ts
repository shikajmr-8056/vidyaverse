export function scoreQuiz(questions: { correct: number }[], answers: (number | null)[]): number {
  return questions.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
}
