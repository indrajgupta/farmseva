import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { TASKS, TASK_ICONS, TASK_DESCRIPTIONS } from '../store/mockData.js'

export default function TaskSelection() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  return (
    <div className="page-content-narrow">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
            What work do you need done?
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Select a task type to get matched with the right machinery
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-xl)', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--color-primary)', color: 'white',
            fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>1</span>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>Task Type</span>
        </div>
        <div style={{ flex: 1, height: 2, background: 'var(--color-border)' }} />
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>2 Requirements</span>
        <div style={{ flex: 1, height: 2, background: 'var(--color-border)' }} />
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>3 Results</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-2xl)',
      }}>
        {TASKS.map((task) => (
          <button
            key={task}
            onClick={() => setSelected(task)}
            style={{
              padding: 'var(--space-xl) var(--space-md)',
              border: selected === task
                ? '2px solid var(--color-primary)'
                : '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              background: selected === task ? 'var(--color-primary-light)' : 'var(--color-surface)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              transition: 'all var(--transition-base)',
              position: 'relative',
              boxShadow: selected === task ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            }}
          >
            {selected === task && (
              <span style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Check size={13} color="white" strokeWidth={3} />
              </span>
            )}
            <span style={{ fontSize: 40 }}>{TASK_ICONS[task]}</span>
            <span style={{
              fontWeight: 700,
              fontSize: 'var(--font-size-md)',
              color: selected === task ? 'var(--color-primary-dark)' : 'var(--color-text)',
            }}>
              {task}
            </span>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}>
              {TASK_DESCRIPTIONS[task]}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary btn-lg"
          disabled={!selected}
          onClick={() => navigate('/farm-service/requirements', { state: { task: selected } })}
        >
          Next: Add Details
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
