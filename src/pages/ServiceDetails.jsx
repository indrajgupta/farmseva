import React, { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Calendar, Clock } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import { computeServicePrice, computeRentalPrice } from '../utils/scoring.js'
import RatingStars from '../components/RatingStars.jsx'
import PriceSummary from '../components/PriceSummary.jsx'

const CATEGORY_ICONS = {
  Harvester: '🌾', Tractor: '🚜', Rotavator: '⚙️', Seeder: '🌱',
  Sprayer: '💧', Cultivator: '🔧', Trailer: '🚛', Other: '🛠️',
}
const CATEGORY_BG = {
  Harvester: '#e8f5e9', Tractor: '#e3f2fd', Rotavator: '#fff8e1', Seeder: '#f1f8e9',
  Sprayer: '#e1f5fe', Cultivator: '#fce4ec', Trailer: '#f3e5f5', Other: '#f5f5f5',
}

export default function ServiceDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const { machineId } = useParams()
  const { state } = useStore()

  const mode = location.state?.mode || 'service' // 'service' or 'rental'
  const request = location.state?.request
  const rentalDate = location.state?.rentalDate
  const rentalDuration = location.state?.rentalDuration || 1
  const fromPath = location.state?.from || (mode === 'rental' ? '/equipment/search' : -1)

  const machine = state.machines.find((m) => m.id === machineId)
  const provider = machine ? state.providers.find((p) => p.id === machine.providerId) : null

  const [operatorSelected, setOperatorSelected] = useState(machine?.operatorAvailable || false)
  const [duration, setDuration] = useState(rentalDuration)
  const [selectedDate, setSelectedDate] = useState(rentalDate || request?.date || '')

  if (!machine) {
    return (
      <div className="page-content-narrow">
        <p>Machine not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    )
  }

  const pricing = mode === 'service'
    ? computeServicePrice(machine, request?.areaAcres || 1, operatorSelected)
    : computeRentalPrice(machine, duration, operatorSelected)

  const handleBookNow = () => {
    const bookingDraft = {
      mode,
      machine,
      provider,
      request,
      operatorSelected,
      pricing,
      selectedDate: selectedDate || request?.date,
      duration: mode === 'rental' ? duration : null,
      durationOrTime: mode === 'service' ? request?.time : `${duration} day${duration !== 1 ? 's' : ''}`,
    }
    navigate(mode === 'service' ? '/farm-service/confirm' : '/equipment/confirm', {
      state: { bookingDraft },
    })
  }

  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Back */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <button className="back-btn" onClick={() => navigate(fromPath, { state: location.state })}>
            <ArrowLeft size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-xl)', alignItems: 'start' }}>
          {/* Left: Details */}
          <div>
            {/* Machine image placeholder */}
            <div style={{
              height: 240,
              background: CATEGORY_BG[machine.category] || '#f5f5f5',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 96,
              marginBottom: 'var(--space-xl)',
              border: '1px solid var(--color-border)',
            }}>
              {CATEGORY_ICONS[machine.category] || '🚜'}
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)', flexWrap: 'wrap' }}>
                <span className="badge badge-gray">{machine.category}</span>
                <span className={`badge ${machine.available ? 'badge-green' : 'badge-red'}`}>
                  {machine.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>
                {machine.name}
              </h1>
              <RatingStars rating={machine.rating} size={16} />
            </div>

            {/* Provider */}
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Provider</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>{provider?.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    <MapPin size={14} /> {machine.location} &nbsp;·&nbsp; {machine.distanceKm} km away
                  </div>
                </div>
                {provider && <RatingStars rating={provider.rating} />}
              </div>
            </div>

            {/* Specs */}
            {machine.specs?.length > 0 && (
              <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Specifications</h2>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                  {machine.specs.map((s) => (
                    <span key={s} className="badge badge-gray" style={{ fontSize: 12 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Suitable for */}
            <div className="card">
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Suitable For</h2>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
                {machine.suitableFor.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Crops: {machine.suitableCrops.join(', ')}
              </div>
            </div>
          </div>

          {/* Right: Booking panel */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + var(--space-lg))' }}>
            <div className="card" style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: 28, fontWeight: 800 }}>₹{machine.pricePerUnit.toLocaleString()}</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginLeft: 4 }}>
                  {machine.pricingUnit}
                </span>
              </div>

              {/* Booking details */}
              {mode === 'service' && request && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Calendar size={14} /> {request.date}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Clock size={14} /> {request.time}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    📐 {request.areaAcres} acres
                  </div>
                </div>
              )}

              {/* Rental duration */}
              {mode === 'rental' && (
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label className="form-label">Rental Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (days)</label>
                    <select
                      className="form-input"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    >
                      {[1, 2, 3, 5, 7, 10].map((d) => (
                        <option key={d} value={d}>{d} day{d !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Operator toggle */}
              {machine.operatorAvailable && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-md)',
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-md)',
                  border: '1px solid var(--color-border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                      <Users size={14} style={{ display: 'inline', marginRight: 4 }} />
                      Include Operator
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      +₹500{mode === 'rental' ? '/day' : ''}
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={operatorSelected}
                      onChange={() => setOperatorSelected(!operatorSelected)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              )}
              {!machine.operatorAvailable && (
                <div style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  background: '#fff8e1',
                  border: '1px solid #ffe082',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-md)',
                  fontSize: 'var(--font-size-sm)',
                  color: '#f57c00',
                }}>
                  ⚠️ Operator not available for this machine
                </div>
              )}

              {/* Price summary */}
              <PriceSummary
                base={pricing.base}
                operatorFee={pricing.operatorFee}
                serviceFee={pricing.serviceFee}
                total={pricing.total}
                pricingUnit={mode === 'service'
                  ? `${request?.areaAcres} acres × ₹${machine.pricePerUnit}`
                  : `${duration} days × ₹${machine.pricePerUnit}`}
              />

              <button
                className="btn btn-primary btn-lg btn-full"
                style={{ marginTop: 'var(--space-md)' }}
                onClick={handleBookNow}
                disabled={!machine.available || (mode === 'rental' && !selectedDate)}
              >
                {mode === 'service' ? 'Book Now' : 'Rent Now'} →
              </button>

              {!machine.available && (
                <p style={{ textAlign: 'center', color: '#c62828', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)' }}>
                  This machine is currently unavailable.{' '}
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => navigate(-1)}>
                    Choose another
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="mobile-sticky-bar">
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>₹{pricing.total.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Total incl. fees</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleBookNow}
          disabled={!machine.available}
        >
          {mode === 'service' ? 'Book Now' : 'Rent Now'} →
        </button>
      </div>

      <style>{`
        .mobile-sticky-bar {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-sticky-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: var(--color-surface);
            border-top: 1px solid var(--color-border);
            padding: var(--space-md) var(--space-lg);
            z-index: 100;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
          }
        }
        @media (max-width: 768px) {
          .service-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
