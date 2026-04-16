import { formatDuration } from '../../utils/formatters'

export default function Timer({ seconds, warning = 300 }) {
  const isWarning = seconds <= warning && seconds > 0
  const isDanger = seconds <= 60 && seconds > 0
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg
      ${isDanger ? 'bg-red-100 text-red-700 animate-pulse' : isWarning ? 'bg-yellow-100 text-yellow-700' : 'bg-white/20 text-white'}`}>
      <span>⏱</span>
      <span>{formatDuration(seconds)}</span>
    </div>
  )
}
