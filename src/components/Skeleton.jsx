const pulse = {
  animation: 'skeleton-pulse 1.6s ease-in-out infinite',
}

const base = {
  background: 'var(--surface2)',
  borderRadius: '4px',
  ...pulse,
}

export function SkeletonBlock({ width = '100%', height = '14px', radius = '4px', style = {} }) {
  return (
    <div style={{ ...base, width, height, borderRadius: radius, ...style }} />
  )
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '0.5px solid var(--border)',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {/* Flag */}
      <div style={{ ...base, height: '120px', borderRadius: 0 }} />
      {/* Body */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SkeletonBlock height="13px" width="70%" />
        <SkeletonBlock height="10px" width="45%" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <SkeletonBlock height="18px" width="52px" radius="3px" />
          <SkeletonBlock height="10px" width="30px" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonDetailPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Back */}
      <SkeletonBlock width="48px" height="11px" style={{ marginBottom: '32px' }} />

      {/* Flag hero */}
      <div style={{ ...base, height: '220px', borderRadius: '8px', marginBottom: '28px' }} />

      {/* Subregion */}
      <SkeletonBlock width="140px" height="10px" style={{ marginBottom: '8px' }} />
      {/* Name */}
      <SkeletonBlock width="260px" height="40px" radius="4px" style={{ marginBottom: '16px' }} />
      {/* Visited btn */}
      <SkeletonBlock width="130px" height="30px" radius="4px" style={{ marginBottom: '28px' }} />

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '0.5px solid var(--border)',
            borderRadius: '6px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <SkeletonBlock width="60px" height="9px" />
            <SkeletonBlock width="80%" height="14px" />
          </div>
        ))}
      </div>

      {/* Languages */}
      <div style={{
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: '6px',
        padding: '14px 16px',
        marginBottom: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <SkeletonBlock width="60px" height="9px" />
        <SkeletonBlock width="55%" height="13px" />
      </div>

      {/* Weather + Exchange */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '0.5px solid var(--border)',
            borderRadius: '6px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <SkeletonBlock width="70px" height="9px" />
            <SkeletonBlock width="80px" height="40px" />
            <SkeletonBlock width="60%" height="11px" />
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ ...base, height: '220px', borderRadius: '6px', marginBottom: '8px' }} />

      {/* Borders */}
      <div style={{
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: '6px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <SkeletonBlock width="120px" height="9px" />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} width="90px" height="28px" radius="3px" />
          ))}
        </div>
      </div>
    </div>
  )
}