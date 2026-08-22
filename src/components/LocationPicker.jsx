import React, { useState, useCallback, useEffect, useRef } from 'react'
import { MapPin, Loader2, Navigation, X, CheckCircle, Map } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix Leaflet default marker icons (Vite/webpack issue)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Custom green pin marker
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

/** Reverse geocode lat/lng to a readable address string */
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    const addr = data.address || {}
    const parts = [
      addr.village || addr.town || addr.suburb || addr.neighbourhood,
      addr.county || addr.district,
      addr.state_district,
      addr.state,
    ].filter(Boolean)
    return parts.length >= 2
      ? parts.slice(0, 3).join(', ')
      : data.display_name?.split(',').slice(0, 3).join(',').trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

/** Leaflet click handler — child component inside MapContainer */
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) })
  return null
}

/** Full-screen interactive map modal */
function MapPickerModal({ initialCoords, onConfirm, onClose }) {
  const defaultCenter = initialCoords
    ? [initialCoords.lat, initialCoords.lng]
    : [26.8467, 80.9462] // Default: Lucknow, UP

  const [pinCoords, setPinCoords] = useState(initialCoords || null)
  const [address, setAddress] = useState('')
  const [geocoding, setGeocoding] = useState(false)

  const handleMapClick = useCallback(async ({ lat, lng }) => {
    setPinCoords({ lat, lng })
    setGeocoding(true)
    const addr = await reverseGeocode(lat, lng)
    setAddress(addr)
    setGeocoding(false)
  }, [])

  const handleConfirm = () => {
    if (pinCoords) {
      onConfirm({ address, lat: pinCoords.lat, lng: pinCoords.lng })
    }
  }

  return (
    <div className="map-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="map-modal">
        <div className="map-modal__header">
          <MapPin size={16} />
          <span>Tap on the map to pin your farm location</span>
          <button className="map-modal__close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="map-modal__map-wrap">
          <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {pinCoords && (
              <Marker position={[pinCoords.lat, pinCoords.lng]} icon={greenIcon} />
            )}
          </MapContainer>

          {!pinCoords && (
            <div className="map-modal__hint">
              <MapPin size={14} /> Tap anywhere on the map to drop a pin
            </div>
          )}
        </div>

        <div className="map-modal__footer">
          {pinCoords ? (
            <div className="map-modal__address">
              {geocoding ? (
                <><Loader2 size={13} className="spin" /> Getting address…</>
              ) : (
                <><CheckCircle size={13} style={{ color: '#2e7d32' }} /> {address || `${pinCoords.lat.toFixed(4)}, ${pinCoords.lng.toFixed(4)}`}</>
              )}
            </div>
          ) : (
            <div className="map-modal__address" style={{ color: 'var(--color-text-muted)' }}>
              No location selected yet
            </div>
          )}
          <div className="map-modal__actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={!pinCoords || geocoding}
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
  const [geoError, setGeoError] = useState('')
  const [mapOpen, setMapOpen] = useState(false)
  const [leafletCss, setLeafletCss] = useState(false)

  // Dynamically inject Leaflet CSS once
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
      link.onload = () => setLeafletCss(true)
    } else {
      setLeafletCss(true)
    }
  }, [])

  const applyCoords = useCallback(async (lat, lng, accuracy) => {
    setCoords({ lat, lng, accuracy: accuracy || 0 })
    const addr = await reverseGeocode(lat, lng)
    onChange({ address: addr, lat, lng })
    setStatus('success')
  }, [onChange])

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error')
      setGeoError('Geolocation is not supported by your browser.')
      return
    }
    setStatus('loading')
    setGeoError('')

    // Try WITHOUT enableHighAccuracy first — works better on many mobile browsers
    // Falls back to a second attempt with high accuracy if it fails
    let resolved = false

    const tryGPS = (highAccuracy, timeout) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (resolved) return
          resolved = true
          applyCoords(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy)
        },
        (err) => {
          if (resolved) return
          if (!highAccuracy) {
            // Retry with high accuracy
            tryGPS(true, 12000)
          } else {
            resolved = true
            setStatus(err.code === 1 ? 'denied' : 'error')
            setGeoError(
              err.code === 1
                ? 'Location access denied. Tap "Pick on Map" to pin your location manually.'
                : 'GPS signal weak. Tap "Pick on Map" to pin your location manually.'
            )
          }
        },
        { enableHighAccuracy: highAccuracy, timeout, maximumAge: 30000 }
      )
    }

    tryGPS(false, 8000)
  }, [applyCoords])

  const clearLocation = () => {
    setStatus('idle')
    setCoords(null)
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
      {/* Input row */}
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

        {/* GPS Button */}
        <button
          type="button"
          className={`btn location-picker__btn${status === 'loading' ? ' btn-disabled' : ''}`}
          onClick={detectLocation}
          disabled={status === 'loading'}
          title="Auto-detect using GPS"
        >
          {status === 'loading'
            ? <><Loader2 size={15} className="spin" /> Detecting…</>
            : <><Navigation size={15} /> GPS</>
          }
        </button>

        {/* Pick on Map Button */}
        <button
          type="button"
          className="btn location-picker__map-btn"
          onClick={() => setMapOpen(true)}
          title="Pick location on map"
        >
          <Map size={15} /> Pin on Map
        </button>
      </div>

      {/* Status badges */}
      {status === 'success' && coords && (
        <div className="location-picker__status location-picker__status--success">
          <CheckCircle size={13} />
          <span>
            {coords.accuracy > 0
              ? `GPS detected · ±${Math.round(coords.accuracy)}m accuracy`
              : 'Location pinned on map'}
          </span>
        </div>
      )}
      {(status === 'denied' || status === 'error') && (
        <div className="location-picker__status location-picker__status--error">
          <X size={13} />
          <span>{geoError}</span>
        </div>
      )}

      {/* Map Modal */}
      {mapOpen && leafletCss && (
        <MapPickerModal
          initialCoords={coords}
          onConfirm={handleMapConfirm}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  )
}
