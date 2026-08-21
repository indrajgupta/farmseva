import React from 'react'

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs-wrapper">
      <div className="tabs-scroll">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${active === tab.id ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      <style>{`
        .tabs-wrapper {
          border-bottom: 2px solid var(--color-border);
          margin-bottom: var(--space-xl);
          overflow-x: auto;
        }
        .tabs-scroll {
          display: flex;
          gap: 4px;
          white-space: nowrap;
        }
        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: var(--space-sm) var(--space-md);
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-secondary);
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          cursor: pointer;
          background: none;
          border-top: none;
          border-left: none;
          border-right: none;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .tab-btn:hover {
          color: var(--color-text);
        }
        .tab-btn.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }
        .tab-count {
          background: var(--color-surface-alt);
          color: var(--color-text-secondary);
          border-radius: var(--radius-full);
          padding: 1px 7px;
          font-size: var(--font-size-xs);
          font-weight: 700;
        }
        .tab-btn.active .tab-count {
          background: var(--color-primary-light);
          color: var(--color-primary);
        }
      `}</style>
    </div>
  )
}
