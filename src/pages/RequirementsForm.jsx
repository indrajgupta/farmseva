import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { CROPS, TASK_ICONS } from '../store/mockData.js'

const today = new Date().toISOString().split('T')[0]

export default function RequirementsForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const task = location.state?.task || 'Harvesting'

  const [form, setForm] = useState({
    crop: '',
    area: '',
    location: 'Lucknow, UP',
    date: '',
    time: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.crop) e.crop = 'Please select a crop'
    if (!form.area || isNaN(form.area) || Number(form.area) <= 0) e.area = 'Enter a valid area (acres > 0)'
    if (!form.location.trim()) e.location = 'Enter your location'
    if (!form.date) e.date = 'Select a date'
    else if (form.date < today) e.date = 'Date must be today or later'
    if (!form.time) e.time = 'Select a time'
    return e
  }

  const isValid = () => {
    return form.crop && form.area && Number(form.area) > 0 && form.location.trim() &&
      form.date && form.date >= today && form.time
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    // Mock delay to feel real
    await new Promise((r) => setTimeout(r, 600))
    navigate('/farm-service/results', {
      state: {
        request: {
          task,
          crop: form.crop,
          areaAcres: Number(form.area),
          location: form.location,
          date: form.date,
          time: form.time,
        },
      },
    })
  }

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  return (
    <div className="page-content-narrow">
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-xl)', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>1 Task Type</span>
        <div style={{ flex: 1, height: 2, background: 'var(--color-border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--color-primary)', color: 'white',
            fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>2</span>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>Requirements</span>
        </div>
        <div style={{ flex: 1, height: 2, background: 'var(--color-border)' }} />
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>3 Results</span>
      </div>

      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/farm-service/task')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
            Your Requirements
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Tell us more so we can find the best match
          </p>
        </div>
      </div>

      {/* Task chip */}
      <button
        className="chip chip-clickable"
        style={{ marginBottom: 'var(--space-xl)', fontSize: 'var(--font-size-md)' }}
        onClick={() => navigate('/farm-service/task')}
        title="Change task"
      >
        <span>{TASK_ICONS[task]}</span>
        {task}
        <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 4 }}>✏️ Change</span>
      </button>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Crop */}
          <div className="form-group">
            <label className="form-label">Crop *</label>
            <select
              className={`form-input ${errors.crop ? 'error' : ''}`}
              value={form.crop}
              onChange={set('crop')}
            >
              <option value="">Select your crop</option>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.crop && <span className="form-error">{errors.crop}</span>}
          </div>

          {/* Area */}
          <div className="form-group">
            <label className="form-label">Area (Acres) *</label>
            <input
              type="number"
              min="0.1"
              step="0.5"
              className={`form-input ${errors.area ? 'error' : ''}`}
              value={form.area}
              onChange={set('area')}
              placeholder="e.g. 5"
            />
            {errors.area && <span className="form-error">{errors.area}</span>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              className={`form-input ${errors.location ? 'error' : ''}`}
              value={form.location}
              onChange={set('location')}
              placeholder="e.g. Lucknow, UP"
            />
            {errors.location && <span className="form-error">{errors.location}</span>}
          </div>

          {/* Date & Time */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className={`form-input ${errors.date ? 'error' : ''}`}
                value={form.date}
                min={today}
                onChange={set('date')}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Time *</label>
              <select
                className={`form-input ${errors.time ? 'error' : ''}`}
                value={form.time}
                onChange={set('time')}
              >
                <option value="">Select time</option>
                <option value="08:00">8:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
              {errors.time && <span className="form-error">{errors.time}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={!isValid() || loading}
            style={{ marginTop: 'var(--space-sm)' }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Finding Services...
              </>
            ) : (
              <>
                Find Services
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
