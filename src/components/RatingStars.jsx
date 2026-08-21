import React from 'react'
import { Star } from 'lucide-react'

export default function RatingStars({ rating, size = 14 }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <span className="stars" title={`${rating}/5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={size} fill="#f57c00" color="#f57c00" />
      ))}
      {half && <Star size={size} fill="#f9a825" color="#f57c00" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={size} fill="none" color="#d0cbc3" />
      ))}
      <span style={{ marginLeft: 4, fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
        {rating.toFixed(1)}
      </span>
    </span>
  )
}
