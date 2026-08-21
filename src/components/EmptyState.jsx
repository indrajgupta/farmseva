import React from 'react'

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: 'var(--space-3xl) var(--space-xl)',
      gap: 'var(--space-md)',
    }}>
      {icon && (
        <div style={{
          fontSize: 48,
          marginBottom: 'var(--space-sm)',
          opacity: 0.5,
        }}>
          {icon}
        </div>
      )}
      <h3 style={{
        fontSize: 'var(--font-size-lg)',
        fontWeight: 700,
        color: 'var(--color-text)',
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-secondary)',
          maxWidth: 360,
        }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
