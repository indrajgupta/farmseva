import React, { useState, useCallback } from 'react'
import { MapPin, Loader2, Navigation, X, CheckCircle } from 'lucide-react'

/**
 * LocationPicker
 * Uses browser Geolocation API to get exact GPS coordinates,
 * then reverse-geocodes via OpenStreetMap Nominatim (free, no API key).
 * Shows a Google Maps embed pinned to the detected location.
 */
export default function LocationPicker({ value, onChange, error }) {
  const [status, setStatus] = useState('idle') // idle | loading | success | error | denied
  const [coords, setCoords] = useState(null)
  const [mapVisible, setMapVisible] = useState(false)
  const [geoError, setGeoError] = useState('')

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error')
      setGeoError('Geolocation is not supported by your browser.')
      return
    }

    setStatus('loading')
    setGeoError('')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        setCoords({ lat: latitude, lng: longitude, accuracy })

        try {
          // Reverse geocode using OpenStreetMap Nominatim (free, no API key)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()

          // Build a clean Indian address string
          const addr = data.address || {}
          const parts = [
            addr.village || addr.town || addr.suburb || addr.neighbourhood,
            addr.county || addr.district,
            addr.state_district,
            addr.state,
          ].filter(Boolean)

          const displayName =
            parts.length >= 2
              ? parts.slice(0, 3).join(', ')
              : data.display_name?.split(',').slice(0, 3).join(',').trim()

          onChange({ address: displayName, lat: latitude, lng: longitude })
          setStatus('success')
          setMapVisible(true)
        } catch {
          onChange({
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            lat: latitude,
            lng: longitude,
          })
          setStatus('success')
          setMapVisible(true)
        }
      },
      (err) => {
        setStatus(err.code === 1 ? 'denied' : 'error')
        setGeoError(
          err.code === 1
            ? 'Location permission denied. Please allow access in your browser settings.'
            : 'Could not detect your location. Please enter it manually.'
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [onChange])

  const clearLocation = () => {
    setStatus('idle')
    setCoords(null)
    setMapVisible(false)
    onChange({ address: '', lat: null, lng: null })
  }

  const mapSrc = coords
    ? `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`
    : null

  const displayAddress =
    typeof value === 'object' ? value?.address || '' : value || ''

  return (
    <div className="location-picker">
      {/* Input + GPS button row */}
      <div className="location-picker__row">
        <div className="location-picker__input-wrap">
          <MapPin size={16} className="location-picker__icon" />
          <input
            type="text"
            className={`form-input location-picker__input ${error ? 'error' : ''}`}
            value={displayAddress}
            onChange={(e) =>
              onChange(
                coords
                  ? { ...coords, address: e.target.value }
                  : e.target.value
              )
            }
            placeholder="e.g. Lucknow, Uttar Pradesh"
          />
          {status === 'success' && (
            <button
              type="button"
              className="location-picker__clear"
              onClick={clearLocation}
              title="Clear location"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn location-picker__btn${status === 'loading' ? ' btn-disabled' : ''}`}
          onClick={detectLocation}
          disabled={status === 'loading'}
          title="Detect my GPS location"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={15} className="spin" /> Detecting&hellip;
            </>
          ) : (
            <>
              <Navigation size={15} /> Use GPS
            </>
          )}
        </button>
      </div>

      {/* Success badge */}
      {status === 'success' && coords && (
        <div className="location-picker__status location-picker__status--success">
          <CheckCircle size={13} />
          <span>
            Location detected &middot; &plusmn;{Math.round(coords.accuracy || 0)}m accuracy
          </span>
        </div>
      )}

      {/* Error badge */}
      {(status === 'denied' || status === 'error') && (
        <div className="location-picker__status location-picker__status--error">
          <X size={13} />
          <span>{geoError}</span>
        </div>
      )}

      {/* Google Maps embed */}
      {mapVisible && mapSrc && (
        <div className="location-picker__map-container">
          <div className="location-picker__map-header">
            <MapPin size={13} />
            <span>Your Farm Location</span>
            <button
              type="button"
              className="location-picker__map-toggle"
              onClick={() => setMapVisible(false)}
            >
              Hide map
            </button>
          </div>
          <iframe
            title="farm-location-map"
            src={mapSrc}
            className="location-picker__map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}

      {/* Show map button when hidden */}
      {!mapVisible && coords && (
        <button
          type="button"
          className="location-picker__show-map"
          onClick={() => setMapVisible(true)}
        >
          <MapPin size={13} /> Show on map
        </button>
      )}
    </div>
  )
}
