import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Tractor, BookOpen, ChevronRight } from 'lucide-react'
import { useStore, useCurrentProvider, useProviderMachines, useProviderBookings } from '../../store/StoreContext.jsx'
import { ACTIONS, STATUS_LABELS } from '../../store/reducer.js'
import { useToast } from '../../hooks/useToast.js'
import BookingStatusBadge from '../../components/BookingStatusBadge.jsx'
import Tabs from '../../components/Tabs.jsx'
import EmptyState from '../../components/EmptyState.jsx'

const PROVIDER_TABS = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
  { id: 'machines', label: 'Machines', icon: <Tractor size={15} /> },
  { id: 'bookings', label: 'Bookings', icon: <BookOpen size={15} /> },
]

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const provider = useCurrentProvider()
  const machines = useProviderMachines()
  const bookings = useProviderBookings()

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
            <span className="badge badge-green">Provider Dashboard</span>
          </div>
          <h1 className="section-title">{provider?.name || 'Provider Dashboard'}</h1>
          <p className="section-subtitle">Manage your machines and booking requests</p>
        </div>

        {/* Tab nav */}
        <div style={{
          display: 'flex',
          gap: 4,
          borderBottom: '2px solid var(--color-border)',
          marginBottom: 'var(--space-xl)',
          overflowX: 'auto',
        }}>
          {PROVIDER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px var(--space-md)',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                background: 'none',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                marginBottom: -2,
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab machines={machines} bookings={bookings} />}
        {activeTab === 'machines' && <MachinesTab machines={machines} />}
        {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
      </div>
    </div>
  )
}

// ---- OVERVIEW TAB ----
function OverviewTab({ machines, bookings }) {
  const { dispatch } = useStore()
  const toast = useToast()
  const newRequests = bookings.filter((b) => b.status === 'Requested')
  const active = bookings.filter((b) => ['Confirmed', 'OperatorAssigned', 'OnTheWay', 'WorkStarted'].includes(b.status))
  const completed = bookings.filter((b) => b.status === 'Completed')
  const earnings = completed.reduce((sum, b) => sum + b.totalPrice, 0)
  const available = machines.filter((m) => m.available).length
  const utilization = machines.length > 0
    ? Math.round(((machines.length - available) / machines.length) * 100)
    : 0

  const stats = [
    { label: 'Total Machines', value: machines.length },
    { label: 'Available Machines', value: available },
    { label: 'New Requests', value: newRequests.length },
    { label: 'Active Bookings', value: active.length },
    { label: 'Completed Bookings', value: completed.length },
    { label: 'Total Earnings', value: `₹${earnings.toLocaleString()}` },
  ]

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* New requests preview */}
      <div>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          New Requests
          {newRequests.length > 0 && (
            <span style={{
              marginLeft: 8,
              background: 'var(--color-secondary)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              padding: '2px 8px',
              fontSize: 12,
              fontWeight: 700,
            }}>
              {newRequests.length}
            </span>
          )}
        </h2>
        {newRequests.length === 0 ? (
          <div style={{ padding: 'var(--space-xl)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No new requests at the moment
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {newRequests.slice(0, 5).map((booking) => (
              <div key={booking.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <span style={{ fontSize: 28 }}>{booking.type === 'service' ? '🌾' : '🚜'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{booking.machineName}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {booking.date} · ₹{booking.totalPrice.toLocaleString()}
                    {booking.task && ` · ${booking.task}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      dispatch({ type: ACTIONS.ACCEPT_BOOKING, payload: { bookingId: booking.id } })
                      toast.success('Booking accepted!')
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: '#fff', border: '1px solid #c62828', color: '#c62828' }}
                    onClick={() => {
                      dispatch({ type: ACTIONS.REJECT_BOOKING, payload: { bookingId: booking.id } })
                      toast.success('Booking rejected')
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- MACHINES TAB ----
function MachinesTab({ machines }) {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', category: 'Tractor', pricePerUnit: '', pricingUnit: 'per hour' })

  const categories = ['Tractor', 'Harvester', 'Rotavator', 'Seeder', 'Sprayer', 'Cultivator', 'Trailer', 'Other']

  const handleAdd = () => {
    if (!form.name || !form.pricePerUnit) return
    dispatch({
      type: ACTIONS.ADD_MACHINE,
      payload: {
        ...form,
        pricePerUnit: Number(form.pricePerUnit),
        providerId: state.currentProviderId,
        suitableFor: [],
        suitableCrops: [],
        location: state.providers.find((p) => p.id === state.currentProviderId)?.location || 'Lucknow, UP',
        distanceKm: 5,
        availability: [],
      },
    })
    toast.success('Machine added!')
    setShowAddForm(false)
    setForm({ name: '', category: 'Tractor', pricePerUnit: '', pricingUnit: 'per hour' })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Your Machines ({machines.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          + Add Machine
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: 'var(--space-lg)', background: 'var(--color-primary-light)', border: '1.5px solid var(--color-primary)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-md)' }}>Add New Machine</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Machine Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Mahindra 575 Tractor" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price *</label>
              <input type="number" className="form-input" placeholder="e.g. 600" value={form.pricePerUnit} onChange={(e) => setForm((f) => ({ ...f, pricePerUnit: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Pricing Unit</label>
              <select className="form-input" value={form.pricingUnit} onChange={(e) => setForm((f) => ({ ...f, pricingUnit: e.target.value }))}>
                <option value="per hour">per hour</option>
                <option value="per acre">per acre</option>
                <option value="per day">per day</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={!form.name || !form.pricePerUnit}>Add Machine</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {machines.length === 0 ? (
        <EmptyState icon="🚜" title="No machines listed yet" description="Add your first machine to start accepting bookings" action={<button className="btn btn-primary" onClick={() => setShowAddForm(true)}>Add Machine</button>} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="desktop-table">
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((m) => (
                  <MachineRow key={m.id} machine={m} dispatch={dispatch} toast={toast} />
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile card list */}
          <div className="mobile-cards">
            {machines.map((m) => (
              <MachineCard key={m.id} machine={m} dispatch={dispatch} toast={toast} />
            ))}
          </div>
        </>
      )}

      <style>{`
        .mobile-cards { display: none; }
        @media (max-width: 768px) {
          .desktop-table { display: none; }
          .mobile-cards { display: flex; flex-direction: column; gap: var(--space-md); }
        }
      `}</style>
    </div>
  )
}

function MachineRow({ machine, dispatch, toast }) {
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600 }}>{machine.name}</div>
      </td>
      <td><span className="badge badge-gray">{machine.category}</span></td>
      <td>₹{machine.pricePerUnit}/{machine.pricingUnit.replace('per ', '')}</td>
      <td>{machine.rating > 0 ? `⭐ ${machine.rating}` : '—'}</td>
      <td>
        <label className="toggle-switch" title={machine.available ? 'Click to mark unavailable' : 'Click to mark available'}>
          <input
            type="checkbox"
            checked={machine.available}
            onChange={() => {
              dispatch({ type: ACTIONS.TOGGLE_MACHINE_AVAILABILITY, payload: { machineId: machine.id } })
              toast.success(machine.available ? 'Machine marked unavailable' : 'Machine marked available')
            }}
          />
          <span className="toggle-slider" />
        </label>
      </td>
      <td>
        <span className={`badge ${machine.available ? 'badge-green' : 'badge-red'}`}>
          {machine.available ? 'Available' : 'Unavailable'}
        </span>
      </td>
    </tr>
  )
}

function MachineCard({ machine, dispatch, toast }) {
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 700 }}>{machine.name}</div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
          {machine.category} · ₹{machine.pricePerUnit}/{machine.pricingUnit.replace('per ', '')}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <span className={`badge ${machine.available ? 'badge-green' : 'badge-red'}`}>
          {machine.available ? 'Available' : 'Off'}
        </span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={machine.available}
            onChange={() => {
              dispatch({ type: ACTIONS.TOGGLE_MACHINE_AVAILABILITY, payload: { machineId: machine.id } })
              toast.success(machine.available ? 'Machine marked unavailable' : 'Machine available again')
            }}
          />
          <span className="toggle-slider" />
        </label>
      </div>
    </div>
  )
}

// ---- BOOKINGS TAB ----
const BOOKING_TABS = [
  { id: 'new', label: 'New Requests' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

function BookingsTab({ bookings }) {
  const { dispatch } = useStore()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('new')

  const filtered = bookings.filter((b) => {
    if (activeTab === 'new') return b.status === 'Requested'
    if (activeTab === 'confirmed') return b.status === 'Confirmed'
    if (activeTab === 'active') return ['OperatorAssigned', 'OnTheWay', 'WorkStarted'].includes(b.status)
    if (activeTab === 'completed') return b.status === 'Completed'
    if (activeTab === 'cancelled') return b.status === 'Cancelled'
    return true
  })

  const tabs = BOOKING_TABS.map((t) => ({
    ...t,
    count: bookings.filter((b) => {
      if (t.id === 'new') return b.status === 'Requested'
      if (t.id === 'confirmed') return b.status === 'Confirmed'
      if (t.id === 'active') return ['OperatorAssigned', 'OnTheWay', 'WorkStarted'].includes(b.status)
      if (t.id === 'completed') return b.status === 'Completed'
      if (t.id === 'cancelled') return b.status === 'Cancelled'
      return false
    }).length,
  }))

  return (
    <div>
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {filtered.length === 0 ? (
        <EmptyState icon="📋" title={`No bookings with status "${BOOKING_TABS.find((t) => t.id === activeTab)?.label}"`} description="Bookings will appear here as farmers make requests" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {filtered.map((booking) => (
            <ProviderBookingCard
              key={booking.id}
              booking={booking}
              dispatch={dispatch}
              toast={toast}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ProviderBookingCard({ booking, dispatch, toast }) {
  const canAdvance = ['Confirmed', 'OperatorAssigned', 'OnTheWay', 'WorkStarted'].includes(booking.status)
  const { STATUS_ORDER: so } = (() => {
    const STATUS_ORDER = ['Requested', 'Confirmed', 'OperatorAssigned', 'OnTheWay', 'WorkStarted', 'Completed']
    return { STATUS_ORDER }
  })()

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flex: 1 }}>
          <span style={{ fontSize: 28 }}>{booking.type === 'service' ? '🌾' : '🚜'}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>{booking.machineName}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {booking.date}
              {booking.task && ` · ${booking.task}`}
              {booking.crop && ` · ${booking.crop}`}
              {booking.areaAcres && ` · ${booking.areaAcres} acres`}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 6, alignItems: 'center' }}>
              <BookingStatusBadge status={booking.status} />
              <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>₹{booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          {booking.status === 'Requested' && (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => {
                dispatch({ type: ACTIONS.ACCEPT_BOOKING, payload: { bookingId: booking.id } })
                toast.success('Booking confirmed!')
              }}>
                ✓ Accept
              </button>
              <button
                className="btn btn-sm"
                style={{ background: '#fff', border: '1px solid #c62828', color: '#c62828' }}
                onClick={() => {
                  dispatch({ type: ACTIONS.REJECT_BOOKING, payload: { bookingId: booking.id } })
                  toast.success('Booking rejected')
                }}
              >
                ✕ Reject
              </button>
            </>
          )}
          {canAdvance && (
            <button className="btn btn-secondary btn-sm" onClick={() => {
              dispatch({ type: ACTIONS.UPDATE_BOOKING_STATUS, payload: { bookingId: booking.id } })
              toast.success('Status updated!')
            }}>
              → Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


