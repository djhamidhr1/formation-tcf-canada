export default function LoadingSpinner({ size = 'md', color = '#1A5276' }) {
  const sizes = { sm: 20, md: 36, lg: 56 }
  const s = sizes[size] || sizes.md
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <div style={{
        width: s, height: s,
        border: `3px solid #e5e7eb`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
