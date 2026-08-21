import React from 'react'

export function SkeletonCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-md)' }} />
      <div className="skeleton" style={{ height: 20, width: '70%' }} />
      <div className="skeleton" style={{ height: 14, width: '50%' }} />
      <div className="skeleton" style={{ height: 14, width: '40%' }} />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-md)',
      padding: 'var(--space-md)',
      borderBottom: '1px solid var(--color-border-light)',
      alignItems: 'center',
    }}>
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="skeleton" style={{ height: 16, width: '60%' }} />
        <div className="skeleton" style={{ height: 13, width: '40%' }} />
      </div>
      <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 'var(--radius-full)' }} />
    </div>
  )
}

export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  const Component = type === 'card' ? SkeletonCard : SkeletonRow
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  )
}
