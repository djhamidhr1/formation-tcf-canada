export const NCLC_TABLE_CE_CO = [
  { min: 549, max: 699, nclc: 10 },
  { min: 499, max: 548, nclc: 9 },
  { min: 453, max: 498, nclc: 8 },
  { min: 406, max: 452, nclc: 7 },
  { min: 375, max: 405, nclc: 6 },
  { min: 342, max: 374, nclc: 5 },
  { min: 226, max: 341, nclc: 4 },
  { min: 0, max: 225, nclc: 3 },
]

export const NCLC_TABLE_EE_EO = [
  { min: 18, max: 20, nclc: 10 },
  { min: 16, max: 17, nclc: 10 },
  { min: 14, max: 15, nclc: 9 },
  { min: 12, max: 13, nclc: 8 },
  { min: 10, max: 11, nclc: 7 },
  { min: 7, max: 9, nclc: 6 },
  { min: 4, max: 6, nclc: 5 },
  { min: 0, max: 3, nclc: 4 },
]

export function getNclcCeCo(score) {
  const entry = NCLC_TABLE_CE_CO.find(r => score >= r.min && score <= r.max)
  return entry ? entry.nclc : 3
}

export function getNclcEeEo(score) {
  const entry = NCLC_TABLE_EE_EO.find(r => score >= r.min && score <= r.max)
  return entry ? entry.nclc : 4
}
