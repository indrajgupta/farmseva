import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { EQUIPMENT_CATEGORIES } from '../store/mockData.js'
import './EquipmentBrowse.css'

export default function EquipmentBrowse() {
  const navigate = useNavigate()
  const [query, setQuery] = React.useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/equipment/search', { state: { query } })
  }

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-2xl)', maxWidth: 640 }}>
          <h1 className="section-title">Equipment Rental</h1>
          <p className="section-subtitle">
            Know what you need? Browse our full catalogue of farm machinery available near Lucknow.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: 'var(--space-2xl)', maxWidth: 520 }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="Search equipment (e.g. Rotavator, Tractor...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>

        {/* Category grid */}
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
          Browse by Category
        </h2>
        <div className="category-grid">
          {EQUIPMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="category-tile"
              onClick={() => navigate('/equipment/search', { state: { category: cat.id } })}
              id={`cat-${cat.id}`}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
              <span className="cat-count">{cat.count} available</span>
            </button>
          ))}
        </div>

        {/* Demo note */}
        <div style={{
          marginTop: 'var(--space-2xl)',
          padding: 'var(--space-md)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
        }}>
          📍 Showing machinery available near <strong>Lucknow, UP</strong>. All data is fictional for demo purposes.
        </div>
      </div>
    </div>
  )
}
