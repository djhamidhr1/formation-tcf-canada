const COLORS = {
  blue: 'bg-[#e8f7f8] text-[#0F3D58]',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-[#e8f7f8] text-[#0F3D58]',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-700',
  orange: 'bg-[#F98012]/10 text-[#F98012]',
}

export default function Badge({ children, color = 'blue', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${COLORS[color] || COLORS.blue} ${className}`}>
      {children}
    </span>
  )
}
