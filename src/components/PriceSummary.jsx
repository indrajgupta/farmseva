import React from 'react'

export default function PriceSummary({ base, operatorFee, serviceFee, total, pricingUnit }) {
  return (
    <div style={{
      background: 'var(--color-bg)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PriceRow label="Base Price" value={base} note={pricingUnit} />
        {operatorFee > 0 && <PriceRow label="Operator Fee" value={operatorFee} />}
        <PriceRow label="Service Fee" value={serviceFee} />
        <div style={{ height: 1, background: 'var(--color-border)', margin: '4px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--color-text)' }}>
            Total
          </span>
          <span style={{ fontWeight: 800, fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)' }}>
            ₹{total.toLocaleString()}
          </span>
        </div>
      </div>
      <p style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)',
        marginTop: 'var(--space-sm)',
      }}>
        * Mock pricing for demo purposes only. Not actual market rates.
      </p>
    </div>
  )
}

function PriceRow({ label, value, note }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        {label} {note && <span style={{ color: 'var(--color-text-muted)' }}>({note})</span>}
      </span>
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
        ₹{value.toLocaleString()}
      </span>
    </div>
  )
}
