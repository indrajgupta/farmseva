import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Tractor, BookOpen, LayoutDashboard } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/farm-service', label: 'Farm Services' },
    { to: '/equipment', label: 'Equipment Rental' },
    { to: '/bookings', label: 'My Bookings' },
    { to: '/provider', label: 'Provider' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <Tractor size={22} />
          <span>Farm<strong>Seva</strong></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar-link ${isActive(l.to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/bookings"
            className="btn btn-secondary btn-sm navbar-cta"
            onClick={() => setMenuOpen(false)}
          >
            <BookOpen size={15} />
            My Bookings
          </Link>
        </div>

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  )
}
