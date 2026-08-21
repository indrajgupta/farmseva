import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock } from 'lucide-react'
import { useStore, useFarmerBookings } from '../store/StoreContext.jsx'
import { useToast } from '../hooks/useToast.js'
import { ACTIONS, STATUS_ORDER, STATUS_LABELS } from '../store/reducer.js'
import Tabs from '../components/Tabs.jsx'
import BookingStatusBadge from '../components/BookingStatusBadge.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonRow } from '../components/LoadingSkeleton.jsx'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'service', label: 'Farm Services' },
  { id: 'rental', label: 'Rentals' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function MyBookings() {
  const navigate = useNavigate()
  const { state, dispatch } = useStore()
  const toast = useToast()
  const allBookings = useFarmerBookings()
  const [activeTab, setActiveTab] = useState('all')
  const [loading] = useState(false)

  const tabsWithCount = TABS.map((t) => ({
    ...t,
    count: allBookings.filter((b) => {
      if (t.id === 'all') return true
      if (t.id === 'service') return b.type === 'service' && b.status !== 'Completed' && b.status !== 'Cancelled'
      if (t.id === 'rental') return b.type === 'rental' && b.status !== 'Completed' && b.status !== 'Cancelled'
      if (t.id === 'completed') return b.status === 'Completed'
      if (t.id === 'cancelled') return b.status === 'Cancelled'
      return false
    }).length,
  }))

  const filtered = useMemo(() => {
    return allBookings.filter((b) => {
      if (activeTab === 'all') return true
      if (activeTab === 'service') return b.type === 'service' && b.status !== 'Completed' && b.status !== 'Cancelled'
      if (activeTab === 'rental') return b.type === 'rental' && b.status !== 'Completed' && b.status !== 'Cancelled'
      if (activeTab === 'completed') return b.status === 'Completed'
      if (activeTab === 'cancelled') return b.status === 'Cancelled'
      return false
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [allBookings, activeTab])

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 className="section-title">My Bookings</h1>
          <p className="section-subtitle">Track all your farm service and equipment rental bookings</p>
        </div>

        <Tabs tabs={tabsWithCount} active={activeTab} onChange={setActiveTab} />

        {loading ? (
          <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No bookings yet"
            description="Book a farm service or rent equipment to see your bookings here"
            action={
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <button className="btn btn-primary" onClick={() => navigate('/farm-service/task')}>
                  Book Farm Service
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/equipment')}>
                  Rent Equipment
                </button>
              </div>
            }
          />
        ) : (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {filtered.map((booking, i) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                providers={state.providers}
                onView={() => navigate(`/bookings/${booking.id}`, { state: { booking } })}
                isLast={i === filtered.length - 1}
                onCancel={() => {
                  dispatch({ type: ACTIONS.CANCEL_BOOKING, payload: { bookingId: booking.id } })
                  toast.success('Booking cancelled')
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingRow({ booking, providers, onView, isLast, onCancel }) {
  const provider = providers.find((p) => p.id === booking.providerId)

  return (
    <div
      onClick={onView}
      style={{
        display: 'flex',
        gap: 'var(--space-md)',
        padding: 'var(--space-md) var(--space-lg)',
        borderBottom: isLast ? 'none' : '1px solid var(--color-border-light)',
        cursor: 'pointer',
        alignItems: 'center',
        transition: 'background var(--transition-fast)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 28, flexShrink: 0 }}>{booking.type === 'service' ? '🌾' : '🚜'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--color-text)', marginBottom: 2 }}>
          {booking.machineName}
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <span>{provider?.name}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} /> {booking.date}
          </span>
          {booking.task && <span>🌾 {booking.task}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
        <BookingStatusBadge status={booking.status} />
        <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>₹{booking.totalPrice.toLocaleString()}</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
        {(booking.status === 'Requested' || booking.status === 'Confirmed') && (
          <button
            className="btn btn-sm"
            style={{ background: '#fff', border: '1px solid #c62828', color: '#c62828' }}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

