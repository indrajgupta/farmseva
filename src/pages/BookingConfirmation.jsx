import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Calendar, MapPin, Users, Loader2 } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import { ACTIONS } from '../store/reducer.js'
import { useToast } from '../hooks/useToast.js'
import PriceSummary from '../components/PriceSummary.jsx'

export default function BookingConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch } = useStore()
  const toast = useToast()

  const draft = location.state?.bookingDraft
  const mode = draft?.mode || 'service'

  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)

  if (!draft) {
    return (
      <div className="page-content-narrow">
        <p>No booking data. Please start over.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    )
  }

  const { machine, provider, request, operatorSelected, pricing, selectedDate, duration, durationOrTime } = draft

  const handleConfirm = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    dispatch({
      type: ACTIONS.CREATE_BOOKING,
      payload: {
        type: mode,
        farmerId: state.currentFarmerId,
        providerId: machine.providerId,
        machineId: machine.id,
        machineName: machine.name,
        task: request?.task || null,
        crop: request?.crop || null,
        areaAcres: request?.areaAcres || null,
        date: selectedDate || request?.date,
        durationOrTime,
        operatorSelected,
        basePrice: pricing.base,
        operatorFee: pricing.operatorFee,
        serviceFee: pricing.serviceFee,
        totalPrice: pricing.total,
      },
    })
    // Read the generated ID from store state — but since dispatch is sync in reducer,
    // we capture it via a ref approach:
    const newId = `FS${101 + state.bookings.length}`
    setBookingId(newId)
    setLoading(false)
    setConfirmed(true)
    toast.success('Booking confirmed!')
  }

  if (confirmed) {
    return (
      <div className="page-content-narrow">
        <div className="success-container">
          <div className="success-icon">
            <CheckCircle size={40} />
          </div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-text)' }}>
            Booking Requested!
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-md)' }}>
            Your booking has been sent to the provider. You'll be notified once they confirm.
          </p>
          <div style={{
            background: 'var(--color-primary-light)',
            border: '1.5px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg) var(--space-xl)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Booking ID</div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: 2 }}>
              {state.lastCreatedBookingId || bookingId}
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="badge badge-amber">Requested</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/bookings')}>
              View My Bookings
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content-narrow">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
            Review & Confirm
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Check your booking details before confirming
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Machine summary */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Machine</h2>
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <span style={{ fontSize: 40 }}>🚜</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>{machine.name}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {provider?.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 4 }}>
                <MapPin size={12} /> {machine.distanceKm} km away
              </div>
            </div>
          </div>
        </div>

        {/* Task details */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
            {mode === 'service' ? 'Service Details' : 'Rental Details'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {request?.task && <Row icon="🌾" label="Task" value={request.task} />}
            {request?.crop && <Row icon="🌱" label="Crop" value={request.crop} />}
            {request?.areaAcres && <Row icon="📐" label="Area" value={`${request.areaAcres} acres`} />}
            <Row icon="📅" label="Date" value={selectedDate || request?.date} />
            <Row
              icon="🕐"
              label={mode === 'service' ? 'Time' : 'Duration'}
              value={durationOrTime}
            />
            {operatorSelected && <Row icon="👤" label="Operator" value="Included" />}
          </div>
        </div>

        {/* Price */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Price Breakdown</h2>
          <PriceSummary
            base={pricing.base}
            operatorFee={pricing.operatorFee}
            serviceFee={pricing.serviceFee}
            total={pricing.total}
          />
        </div>

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner" /> Confirming...</>
          ) : (
            '✓ Confirm Booking'
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          This is a demo. No real payment will be charged.
        </p>
      </div>
    </div>
  )
}

function Row({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-sm)' }}>
      <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon} {label}
      </span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}

