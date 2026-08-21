import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Search, X, SlidersHorizontal } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import { filterMachines } from '../utils/scoring.js'
import { EQUIPMENT_CATEGORIES, CATEGORY_TO_MACHINE_CATEGORY } from '../store/mockData.js'
import ServiceCard from '../components/ServiceCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'price_asc', label: 'Lowest Price' },
  { value: 'distance', label: 'Nearest' },
  { value: 'rating', label: 'Highest Rated' },
]

export default function EquipmentSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useStore()

  const initCategory = location.state?.category
    ? CATEGORY_TO_MACHINE_CATEGORY[location.state.category]
    : ''

  const [filters, setFilters] = useState({
    query: location.state?.query || '',
    category: initCategory,
    sort: '',
    minRating: 0,
    maxPrice: 0,
    maxDistance: 0,
    date: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const setFilter = (key) => (e) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setFilters((f) => ({ ...f, [key]: val }))
  }

  const clearFilters = () => setFilters({ query: '', category: '', sort: '', minRating: 0, maxPrice: 0, maxDistance: 0, date: '' })

  const results = useMemo(() => filterMachines(state.machines, filters, state.bookings), [state.machines, state.bookings, filters])

  const hasActiveFilters = filters.category || filters.minRating || filters.maxPrice || filters.maxDistance || filters.date

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          <button className="back-btn" onClick={() => navigate('/equipment')}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>
            {filters.category || 'All Equipment'}
          </h1>
        </div>

        {/* Search + filter row */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by name, category..."
              value={filters.query}
              onChange={setFilter('query')}
            />
          </div>

          {/* Sort */}
          <select className="form-input" style={{ width: 'auto' }} value={filters.sort} onChange={setFilter('sort')}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Filter toggle */}
          <button
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={15} />
            Filters {hasActiveFilters ? '•' : ''}
          </button>
        </div>

        {/* Expanded filter panel */}
        {showFilters && (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-md)',
          }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={filters.category} onChange={setFilter('category')}>
                <option value="">All Categories</option>
                {EQUIPMENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={CATEGORY_TO_MACHINE_CATEGORY[c.id]}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Min Rating</label>
              <select className="form-input" value={filters.minRating} onChange={setFilter('minRating')}>
                <option value={0}>Any rating</option>
                <option value={4}>4+ ★</option>
                <option value={4.5}>4.5+ ★</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Max Price (₹/unit)</label>
              <select className="form-input" value={filters.maxPrice} onChange={setFilter('maxPrice')}>
                <option value={0}>Any price</option>
                <option value={400}>Up to ₹400</option>
                <option value={600}>Up to ₹600</option>
                <option value={900}>Up to ₹900</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Max Distance (km)</label>
              <select className="form-input" value={filters.maxDistance} onChange={setFilter('maxDistance')}>
                <option value={0}>Any distance</option>
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={15}>Within 15 km</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Available on Date</label>
              <input type="date" className="form-input" value={filters.date} min={new Date().toISOString().split('T')[0]} onChange={setFilter('date')} />
            </div>
            {hasActiveFilters && (
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ color: '#c62828' }}>
                  <X size={14} /> Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results count */}
        <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {results.length} machine{results.length !== 1 ? 's' : ''} found
          </span>
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ color: '#c62828', fontSize: 'var(--font-size-sm)' }}>
              <X size={13} /> Clear all filters
            </button>
          )}
        </div>

        {/* Results grid */}
        {results.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No equipment matches your filters"
            description="Try adjusting your search or clearing some filters"
            action={
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            }
          />
        ) : (
          <div className="card-grid-3">
            {results.map((machine) => (
              <ServiceCard
                key={machine.id}
                result={{ machine, isBestMatch: false, isPartialMatch: false }}
                onClick={() => navigate(`/equipment/details/${machine.id}`, {
                  state: { mode: 'rental', from: '/equipment/search' }
                })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
