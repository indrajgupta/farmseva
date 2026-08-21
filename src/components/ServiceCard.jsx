import React from 'react'
import { MapPin, Users, Tractor } from 'lucide-react'
import RatingStars from './RatingStars.jsx'

const CATEGORY_ICONS = {
  Harvester: '🌾',
  Tractor: '🚜',
  Rotavator: '⚙️',
  Seeder: '🌱',
  Sprayer: '💧',
  Cultivator: '🔧',
  Trailer: '🚛',
  Other: '🛠️',
}

const MACHINE_COLORS = {
  Harvester: '#e8f5e9',
  Tractor: '#e3f2fd',
  Rotavator: '#fff8e1',
  Seeder: '#f1f8e9',
  Sprayer: '#e1f5fe',
  Cultivator: '#fce4ec',
  Trailer: '#f3e5f5',
  Other: '#f5f5f5',
}

const PROVIDER_NAMES = {
  p1: 'Singh Agro',
  p2: 'Gupta Farm Equipment',
  p3: 'Lucknow CHC',
  p4: 'Verma Tractors',
  p5: 'Sharma Machinery',
}

function MachineImagePlaceholder({ category }) {
  return (
    <div style={{
      height: 160,
      background: MACHINE_COLORS[category] || '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 64,
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--space-md)',
    }}>
      {CATEGORY_ICONS[category] || '🚜'}
    </div>
  )
}

export default function ServiceCard({ result, onClick }) {
  const { machine, isBestMatch, isPartialMatch } = result

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        border: isBestMatch ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
        transition: 'all var(--transition-base)',
        position: 'relative',
        paddingTop: isBestMatch ? '36px' : 'var(--space-lg)',
      }}
    >
      {isBestMatch && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 'var(--space-md)',
          background: 'var(--color-primary)',
          color: 'white',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
          letterSpacing: '0.5px',
        }}>
          ⭐ BEST MATCH
        </div>
      )}

      {isPartialMatch && (
        <div className="badge badge-amber" style={{ marginBottom: 'var(--space-sm)' }}>
          Partial Match
        </div>
      )}

      <MachineImagePlaceholder category={machine.category} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--color-text)', flex: 1 }}>
          {machine.name}
        </h3>
        <span className="badge badge-gray" style={{ fontSize: 11, flexShrink: 0 }}>{machine.category}</span>
      </div>

      <div style={{ marginTop: 6, marginBottom: 'var(--space-md)' }}>
        <RatingStars rating={machine.rating} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <Tractor size={14} />
          {PROVIDER_NAMES[machine.providerId] || machine.providerId}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <MapPin size={14} />
          {machine.distanceKm} km away
        </div>
        {machine.operatorAvailable && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>
            <Users size={14} />
            Operator available
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 'var(--space-md)',
        borderTop: '1px solid var(--color-border-light)',
      }}>
        <div>
          <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-text)' }}>
            ₹{machine.pricePerUnit.toLocaleString()}
          </span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginLeft: 4 }}>
            {machine.pricingUnit}
          </span>
        </div>
        <span className={`badge ${machine.available ? 'badge-green' : 'badge-red'}`}>
          {machine.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
    </div>
  )
}
