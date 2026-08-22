import React, { useState, useCallback, useRef } from 'react'
import { MapPin, Loader2, Navigation, X, CheckCircle, Map } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// ✅ CRITICAL: Import Leaflet CSS directly — CDN injection is unreliable in Vite
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons broken by Vite's asset pipeline
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Green marker for dropped pin
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

/** Reverse geocode lat/lng → human-readable address via OpenStreetMap (free) */
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    const a = data.address || {}
    const parts = [
      a.village || a.town || a.suburb || a.neighbourhood,
      a.county || a.district,
      a.state_district,
      a.state,
    ].filter(Boolean)
    return parts.length >= 2
      ? parts.slice(0, 3).join(', ')
      : data.display_name?.split(',').slice(0, 3).join(',').trim() || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

/** Captures map click events inside a MapContainer */
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) })
  return null
}

/** Interactive map modal — tap to drop a pin */
function MapPickerModal({ initialCoords, onConfirm, onClose }) {
  const center = initialCoords
    ? [initialCoords.lat, initialCoords.lng]
    : [26.8467, 80.9462] // Default: Lucknow, UP

  const [pin, setPin] = useState(initialCoords || null)
  const [address, setAddress] = useState('')
  const [geocoding, setGeocoding] = useState(false)

  const handleMapClick = useCallback(async ({ lat, lng }) => {
    setPin({ lat, lng })
    setGeocoding(true)
    const addr = await reverseGeocode(lat, lng)
    setAddress(addr)
    setGeocoding(false)
  }, [])

  return (
    <div className="map-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="map-modal">
        {/* Header */}
        <div className="map-modal__header">
          <MapPin size={16} />
          <span>Tap on the map to pin your farm location</span>
          <button className="map-modal__close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        {/* Map — explicit pixel height so Leaflet renders */}
        <div style={{ position: 'relative', height: 360, flex: 'none' }}>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {pin && <Marker position={[pin.lat, pin.lng]} icon={greenIcon} />}
          </MapContainer>

          {/* Overlay hint when no pin dropped yet */}
          {!pin && (
            <div className="map-modal__hint">
              <MapPin size={14} /> Tap anywhere on the map to drop a pin
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="map-modal__footer">
          <div className="map-modal__address">
            {pin ? (
              geocoding
                ? <><Loader2 size={13} className="spin" /> Getting address…</>
                : <><CheckCircle size={13} style={{ color: '#2e7d32' }} /> {address || `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`}</>
            ) : (
              <span style={{ color: 'var(--color-text-muted)' }}>No location selected yet</span>
            )}
          </div>
          <div className="map-modal__actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => pin && onConfirm({ address, lat: pin.lat, lng: pin.lng })}
              disabled={!pin || geocoding}
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Main LocationPicker component */
export default function LocationPicker({ value, onChange, error }) {
  const [status, setStatus] = useState('idle') // idle | loading | success | error | denied
  const [coords, setCoords] = useState(null)
  const [liveAccuracy, setLiveAccuracy] = useState(null) // live accuracy while watching
  const [geoError, setGeoError] = useState('')
  const [mapOpen, setMapOpen] = useState(false)
  const watchIdRef = useRef(null)
  const bestAccuracyRef = useRef(Infinity)
  const bestPositionRef = useRef(null)

  const stopWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  const applyPosition = useCallback(async (lat, lng, accuracy) => {
    stopWatch()
    setLiveAccuracy(null)
    setCoords({ lat, lng, accuracy: accuracy || 0 })
    const addr = await reverseGeocode(lat, lng)
    onChange({ address: addr, lat, lng })
    setStatus('success')
  }, [onChange, stopWatch])

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error')
      setGeoError('Geolocation not supported by this browser.')
      return
    }
    // Stop any existing watch
    stopWatch()
    bestAccuracyRef.current = Infinity
    bestPositionRef.current = null
    setStatus('loading')
    setLiveAccuracy(null)
    setGeoError('')

    // watchPosition keeps firing as GPS chip warms up and gets more satellites.
    // We accept the best fix we get, or stop early if accuracy ≤ 100m.
    const ACCEPT_ACCURACY = 100  // meters — accept immediately if this good
    const MAX_WAIT_MS     = 25000 // wait up to 25s for GPS to lock

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        setLiveAccuracy(Math.round(accuracy))

        // Always keep the best (most accurate) fix so far
        if (accuracy < bestAccuracyRef.current) {
          bestAccuracyRef.current = accuracy
          bestPositionRef.current = { lat: latitude, lng: longitude, accuracy }
        }

        // If it's good enough, accept immediately
        if (accuracy <= ACCEPT_ACCURACY) {
          applyPosition(latitude, longitude, accuracy)
        }
      },
      (err) => {
        stopWatch()
        setLiveAccuracy(null)
        // If we already have a reasonable fix, use it
        if (bestPositionRef.current && bestPositionRef.current.accuracy < 5000) {
          const b = bestPositionRef.current
          applyPosition(b.lat, b.lng, b.accuracy)
        } else {
          setStatus(err.code === 1 ? 'denied' : 'error')
          setGeoError(
            err.code === 1
              ? 'Location access denied. Tap "Pin on Map" to set manually.'
              : 'GPS signal too weak. Tap "Pin on Map" to set manually.'
          )
        }
      },
      { enableHighAccuracy: true, timeout: MAX_WAIT_MS, maximumAge: 0 }
    )

    // Hard timeout — accept best position found so far after MAX_WAIT_MS
    setTimeout(() => {
      if (watchIdRef.current !== null) {
        stopWatch()
        setLiveAccuracy(null)
        if (bestPositionRef.current) {
          const b = bestPositionRef.current
          applyPosition(b.lat, b.lng, b.accuracy)
        } else {
          setStatus('error')
          setGeoError('GPS could not lock. Tap "Pin on Map" to set manually.')
        }
      }
    }, MAX_WAIT_MS)
  }, [applyPosition, stopWatch])

  const clearLocation = () => {
    stopWatch()
    setStatus('idle')
    setCoords(null)
    setLiveAccuracy(null)
    onChange({ address: '', lat: null, lng: null })
  }

  const handleMapConfirm = (picked) => {
    setCoords({ lat: picked.lat, lng: picked.lng, accuracy: 0 })
    onChange(picked)
    setStatus('success')
    setMapOpen(false)
  }

  const displayAddress = typeof value === 'object' ? value?.address || '' : value || ''

  return (
    <div className="location-picker">
      {/* Input + button row */}
      <div className="location-picker__row">
        <div className="location-picker__input-wrap">
          <MapPin size={16} className="location-picker__icon" />
          <input
            type="text"
            className={`form-input location-picker__input ${error ? 'error' : ''}`}
            value={displayAddress}
            onChange={(e) =>
              onChange(coords ? { ...coords, address: e.target.value } : e.target.value)
            }
            placeholder="e.g. Lucknow, Uttar Pradesh"
          />
          {status === 'success' && (
            <button type="button" className="location-picker__clear" onClick={clearLocation} title="Clear">
              <X size={14} />
            </button>
          )}
        </div>

        {/* GPS auto-detect */}
        <button
          type="button"
          className={`btn location-picker__btn${status === 'loading' ? ' btn-disabled' : ''}`}
          onClick={detectLocation}
          disabled={status === 'loading'}
          title="Detect exact GPS location"
        >
          {status === 'loading'
            ? <><Loader2 size={15} className="spin" /> Detecting…</>
            : <><Navigation size={15} /> GPS</>
          }
        </button>

        {/* Manual map pin */}
        <button
          type="button"
          className="btn location-picker__map-btn"
          onClick={() => setMapOpen(true)}
          title="Pin your location on map"
        >
          <Map size={15} /> Pin on Map
        </button>
      </div>

      {/* Status badges */}
      {status === 'loading' && liveAccuracy !== null && (
        <div className="location-picker__status location-picker__status--loading">
          <Loader2 size={13} className="spin" />
          <span>Refining GPS… current accuracy ±{liveAccuracy}m — waiting for better fix</span>
        </div>
      )}
      {status === 'success' && coords && (
        <div className="location-picker__status location-picker__status--success">
          <CheckCircle size={13} />
          <span>
            {coords.accuracy > 0
              ? `GPS locked · ±${Math.round(coords.accuracy)}m accuracy`
              : 'Location pinned on map ✓'}
          </span>
        </div>
      )}
      {(status === 'denied' || status === 'error') && (
        <div className="location-picker__status location-picker__status--error">
          <X size={13} />
          <span>{geoError}</span>
        </div>
      )}

      {/* Map modal — always renders when open, no CSS guard needed */}
      {mapOpen && (
        <MapPickerModal
          initialCoords={coords}
          onConfirm={handleMapConfirm}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  )
}
