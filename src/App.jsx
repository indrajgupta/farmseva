import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './store/StoreContext.jsx'
import Navbar from './components/Navbar.jsx'
import Toast from './components/Toast.jsx'

// Pages
import Home from './pages/Home.jsx'
import TaskSelection from './pages/TaskSelection.jsx'
import RequirementsForm from './pages/RequirementsForm.jsx'
import ServiceResults from './pages/ServiceResults.jsx'
import ServiceDetails from './pages/ServiceDetails.jsx'
import BookingConfirmation from './pages/BookingConfirmation.jsx'
import EquipmentBrowse from './pages/EquipmentBrowse.jsx'
import EquipmentSearch from './pages/EquipmentSearch.jsx'
import MyBookings from './pages/MyBookings.jsx'
import BookingDetails from './pages/BookingDetails.jsx'
import ProviderDashboard from './pages/provider/ProviderDashboard.jsx'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Navbar />
        <Toast />
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Farm Service Flow */}
          <Route path="/farm-service" element={<TaskSelection />} />
          <Route path="/farm-service/task" element={<TaskSelection />} />
          <Route path="/farm-service/requirements" element={<RequirementsForm />} />
          <Route path="/farm-service/results" element={<ServiceResults />} />
          <Route path="/farm-service/details/:machineId" element={<ServiceDetails />} />
          <Route path="/farm-service/confirm" element={<BookingConfirmation />} />

          {/* Equipment Rental Flow */}
          <Route path="/equipment" element={<EquipmentBrowse />} />
          <Route path="/equipment/search" element={<EquipmentSearch />} />
          <Route path="/equipment/details/:machineId" element={<ServiceDetails />} />
          <Route path="/equipment/confirm" element={<BookingConfirmation />} />

          {/* My Bookings */}
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/bookings/:bookingId" element={<BookingDetails />} />

          {/* Provider Dashboard */}
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/provider/*" element={<ProviderDashboard />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
