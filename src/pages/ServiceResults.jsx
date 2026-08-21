import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import { getRecommendations } from '../utils/scoring.js'
import ServiceCard from '../components/ServiceCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonCard } from '../components/LoadingSkeleton.jsx'

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Lowest Price' },
  { value: 'distance', label: 'Nearest' },
  { value: 'rating', label: 'Highest Rated' },
]

export default function ServiceResults() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useStore()
  const request = location.state?.request

  const [sort, setSort] = useState('recommended')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  const results = useMemo(() => {
    if (!request) return []
    return getRecommendations(state.machines, request, state.bookings)
  }, [state.machines, state.bookings, request])

  const sorted = useMemo(() => {
    const arr = [...results]
    if (sort === 'price_asc') arr.sort((a, b) => a.machine.pricePerUnit - b.machine.pricePerUnit)
    else if (sort === 'distance') arr.sort((a, b) => a.machine.distanceKm - b.machine.distanceKm)
    else if (sort === 'rating') arr.sort((a, b) => b.machine.rating - a.machine.rating)
    // recommended: keep original score order
    return arr
  }, [results, sort])

  if (!request) {
    return (
      <div className="page-content-narrow">
        <EmptyState
          icon="🔍"
          title="No search request found"
          description="Please start from the Farm Service flow"
          action={
            <button className="btn btn-primary" onClick={() => navigate('/farm-service/task')}>
              Start Over
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="container">
        {/* Request Summary Bar */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md) var(--space-lg)',
          marginBottom: 'var(--space-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          flexWrap: 'wrap',
        }}>
          <button className="back-btn" onClick={() => navigate('/farm-service/requirements', { state: { task: request.task } })}>
            <ArrowLeft size={18} />
          </button>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', flex: 1 }}>
            <span className="chip">{request.task}</span>
            <span className="chip">{request.crop}</span>
            <span className="chip">{request.areaAcres} acres</span>
            <span className="chip">📍 {request.location}</span>
            <span className="chip">📅 {new Date(request.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            <span className="chip">🕐 {request.time}</span>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/farm-service/requirements', { state: { task: request.task } })}
          >
            Edit
          </button>
        </div>

        {/* Header + Sort */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>
              {loading ? 'Finding services...' : `${sorted.length} service${sorted.length !== 1 ? 's' : ''} found`}
            </h1>
            {results.some((r) => r.isPartialMatch) && (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>
                Showing partial matches — no exact crop-machine combinations available
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <SlidersHorizontal size={16} color="var(--color-text-muted)" />
            <select
              className="form-input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: 'auto', padding: '6px 12px', fontSize: 'var(--font-size-sm)' }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="card-grid-3">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No services found for your request"
            description="No machines are available for the selected task, date, and location. Try adjusting your date or check Equipment Rental."
            action={
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <button className="btn btn-primary" onClick={() => navigate('/farm-service/requirements', { state: { task: request.task } })}>
                  Modify Search
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/equipment')}>
                  Try Equipment Rental
                </button>
              </div>
            }
          />
        ) : (
          <div className="card-grid-3">
            {sorted.map((result) => (
              <ServiceCard
                key={result.machine.id}
                result={result}
                onClick={() => navigate(`/farm-service/details/${result.machine.id}`, {
                  state: { request, machineId: result.machine.id }
                })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
