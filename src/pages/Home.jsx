import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Tractor, CheckCircle, Clock, Star } from 'lucide-react'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span>🌾</span> India's Task-First Farm Machinery Platform
          </div>
          <h1 className="hero-title">
            Tell us what<br />
            <span className="hero-highlight">farm work you need.</span><br />
            We'll arrange the machinery.
          </h1>
          <p className="hero-subtitle">
            No more guessing which machine you need. Just describe your farm task — 
            Ploughing, Sowing, Harvesting, and more — and get matched with the right 
            machine, provider, and optional operator near you.
          </p>
          <div className="hero-ctas">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/farm-service/task')}
              id="cta-book-farm-service"
            >
              Book Farm Service
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/equipment')}
              id="cta-rent-equipment"
            >
              Rent Equipment
            </button>
          </div>
          <p className="hero-note">
            Serving small & marginal farmers across Lucknow, UP
          </p>
        </div>

        <div className="hero-visual">
          <div className="hero-cards">
            <div className="hero-stat-card">
              <span className="hero-stat-icon">🚜</span>
              <div>
                <div className="hero-stat-value">50+</div>
                <div className="hero-stat-label">Machines Listed</div>
              </div>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-icon">⭐</span>
              <div>
                <div className="hero-stat-value">4.7</div>
                <div className="hero-stat-label">Avg. Provider Rating</div>
              </div>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-icon">📍</span>
              <div>
                <div className="hero-stat-value">3–15 km</div>
                <div className="hero-stat-label">Nearby Providers</div>
              </div>
            </div>
            <div className="hero-task-preview">
              {['🌾 Harvesting', '🚜 Ploughing', '🌱 Sowing', '💧 Spraying', '🚛 Transport'].map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 className="section-title">How FarmSeva Works</h2>
            <p className="section-subtitle">Book a complete farm service in 3 simple steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">🌾</div>
              <h3>Choose Your Task</h3>
              <p>Select what farm work you need — Ploughing, Sowing, Harvesting, Spraying, or Transport.</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🔍</div>
              <h3>Get Matched</h3>
              <p>We rank nearby providers by compatibility, distance, rating, and availability for your crop and acreage.</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">✅</div>
              <h3>Book & Track</h3>
              <p>Confirm your booking and track its status in real time — from Request to Work Completed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 'var(--space-xl)' }}>Two Ways to Book</h2>
          <div className="services-grid">
            <div className="service-card-big" onClick={() => navigate('/farm-service/task')}>
              <div className="service-card-icon">🌾</div>
              <div>
                <h3>Farm Service Booking</h3>
                <p>Describe your task. We'll find the right machine + provider + optional operator for your farm.</p>
                <span className="btn btn-primary" style={{ marginTop: 'var(--space-md)', display: 'inline-flex', gap: 8 }}>
                  Book a Service <ArrowRight size={16} />
                </span>
              </div>
            </div>
            <div className="service-card-big secondary" onClick={() => navigate('/equipment')}>
              <div className="service-card-icon">🚜</div>
              <div>
                <h3>Equipment Rental</h3>
                <p>Already know what you need? Browse our full catalogue of tractors, harvesters, sprayers and more.</p>
                <span className="btn btn-secondary" style={{ marginTop: 'var(--space-md)', display: 'inline-flex', gap: 8 }}>
                  Browse Equipment <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo note */}
      <section style={{ background: 'var(--color-surface-alt)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ padding: 'var(--space-xl) var(--space-xl)', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            🛠️ <strong>Demo Prototype</strong> — All data is fictional. This is a technology demonstration of FarmSeva's marketplace concept. Centered in Lucknow, UP.
          </p>
        </div>
      </section>
    </div>
  )
}
