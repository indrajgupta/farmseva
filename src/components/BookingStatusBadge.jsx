import React from 'react'
import { STATUS_LABELS } from '../store/reducer.js'

const STATUS_COLORS = {
  Requested: 'badge-amber',
  Confirmed: 'badge-blue',
  OperatorAssigned: 'badge-purple',
  OnTheWay: 'badge-amber',
  WorkStarted: 'badge-green',
  Completed: 'badge-green',
  Cancelled: 'badge-red',
}

export default function BookingStatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_COLORS[status] || 'badge-gray'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
