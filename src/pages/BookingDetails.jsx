import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import { STATUS_ORDER, STATUS_LABELS } from '../store/reducer.js'
import BookingStatusBadge from '../components/BookingStatusBadge.jsx'
import PriceSummary from '../components/PriceSummary.jsx'

export default function BookingDetails() {
  const navigate = useNavigate()
  const { bookingId } = useParams()
  const { state } = useStore()
  const location = useLocation()

  const booking = state.bookings.find((b) => b.id === bookingId) || location.state?.booking
  const machine = booking ? state.machines.find((m) => m.id === booking.machineId) : null
  const provider = booking ? state.providers.find((p) => p.id === booking.providerId) : null

  if (!booking) {
    return (
      <div className="page-content-narrow">
        <p>Booking not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/bookings')}>Back to My Bookings</button>
      </div>
    )
  }

  const currentStatusIdx = STATUS_ORDER.indexOf(booking.status)
  const isCancelled = booking.status === 'Cancelled'

  return (
    <div className="page-content-narrow">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/bookings')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Booking Details</h1>
          <code style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>#{booking.id}</code>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Status */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 'var(--space-sm)' }}>
            <BookingStatusBadge status={booking.status} />
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Current Status
          </div>
        </div>

        {/* Status Stepper */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Status History</h2>
          {isCancelled ? (
            <div style={{ display: 'flex', gap: 'var(--space-md)', color: '#c62828', fontWeight: 600 }}>
              <span>✕</span>
              <span>Booking Cancelled{booking.cancelReason ? ` — ${booking.cancelReason}` : ''}</span>
            </div>
          ) : (
            <div className="stepper">
              {STATUS_ORDER.map((status, idx) => {
                const isDone = idx < currentStatusIdx
                const isActive = idx === currentStatusIdx
                const isLast = idx === STATUS_ORDER.length - 1
                return (
                  <div key={status} className="stepper-item">
                    <div className="stepper-indicator">
                      <div className={`stepper-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`} />
                      {!isLast && <div className={`stepper-line ${isDone ? 'done' : ''}`} />}
                    </div>
                    <div className={`stepper-label ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                      {STATUS_LABELS[status]}
                      {isActive && (
                        <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Machine & Provider */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Machine & Provider</h2>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: 32 }}>🚜</span>
            <div>
              <div style={{ fontWeight: 700 }}>{booking.machineName}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{provider?.name}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} /> {machine?.location}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Info */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Booking Info</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 'var(--font-size-sm)' }}>
            {booking.task && <InfoRow label="Task" value={booking.task} />}
            {booking.crop && <InfoRow label="Crop" value={booking.crop} />}
            {booking.areaAcres && <InfoRow label="Area" value={`${booking.areaAcres} acres`} />}
            <InfoRow label="Date" value={booking.date} />
            <InfoRow label={booking.type === 'service' ? 'Time' : 'Duration'} value={booking.durationOrTime} />
            <InfoRow label="Operator" value={booking.operatorSelected ? 'Included' : 'Not included'} />
            <InfoRow label="Type" value={booking.type === 'service' ? 'Farm Service' : 'Equipment Rental'} />
          </div>
        </div>

        {/* Price */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Price Breakdown</h2>
          <PriceSummary
            base={booking.basePrice}
            operatorFee={booking.operatorFee}
            serviceFee={booking.serviceFee}
            total={booking.totalPrice}
          />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}
