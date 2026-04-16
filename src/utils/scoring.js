// Points par niveau de question (CE et CO)
export const POINT_SCALE = { A1: 3, A2: 9, B1: 15, B2: 21, C1: 26, C2: 33 }

// Correspondance score → NCLC (CE/CO, score sur 699)
export function scoreToNclc(score) {
  if (score >= 549) return 10
  if (score >= 499) return 9
  if (score >= 453) return 8
  if (score >= 406) return 7
  if (score >= 375) return 6
  if (score >= 342) return 5
  if (score >= 226) return 4
  return 3
}

// Correspondance score EE/EO (/20) → NCLC
export function scoreEEToNclc(score) {
  if (score >= 18) return 10
  if (score >= 16) return 10
  if (score >= 14) return 9
  if (score >= 12) return 8
  if (score >= 10) return 7
  if (score >= 7) return 6
  if (score >= 4) return 5
  return 4
}

// Score total CE basé sur les niveaux des questions correctes
export function calculateCEScore(questions, answers) {
  let total = 0
  questions.forEach((q, i) => {
    if (answers[i] === q.correct_answer_index) {
      total += POINT_SCALE[q.level] || 0
    }
  })
  return total
}

// Niveau global basé sur le score /699
export function scoreToLevel(score) {
  if (score >= 549) return 'C2'
  if (score >= 453) return 'C1'
  if (score >= 342) return 'B2'
  if (score >= 226) return 'B1'
  if (score >= 226) return 'A2'
  return 'A1'
}
