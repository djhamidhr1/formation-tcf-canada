// Formater un slug de mois en label lisible
const MONTH_LABELS = {
  'janvier': 'Janvier', 'fevrier': 'Février', 'mars': 'Mars', 'avril': 'Avril',
  'mai': 'Mai', 'juin': 'Juin', 'juillet': 'Juillet', 'aout': 'Août',
  'septembre': 'Septembre', 'octobre': 'Octobre', 'novembre': 'Novembre', 'decembre': 'Décembre',
}

export function formatMonthSlug(slug) {
  if (!slug) return slug
  const parts = slug.split('-')
  const year = parts[parts.length - 1]
  const monthKey = parts.slice(0, -1).join('-').toLowerCase()
  const monthLabel = MONTH_LABELS[monthKey] || (monthKey.charAt(0).toUpperCase() + monthKey.slice(1))
  return `${monthLabel} ${year}`
}

export function formatDate(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function wordCount(text) {
  if (!text) return 0
  return text.split(/\s+/).filter(w => w.length > 0).length
}
