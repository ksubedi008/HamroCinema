import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import CustomerLayout from './layouts/CustomerLayout'
import DashboardHome from './pages/admin/DashboardHome'
import AdminMovies from './pages/admin/AdminMovies'
import AdminShowtimes from './pages/admin/AdminShowtimes'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import AdminLogin from './pages/auth/AdminLogin'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

import Home from './pages/customer/Home'
import MovieDetails from './pages/customer/MovieDetails'
import SeatSelection from './pages/customer/SeatSelection'
import Checkout from './pages/customer/Checkout'
import MyTickets from './pages/customer/MyTickets'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="book/:id" element={<SeatSelection />} />
          
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          
          <Route path="my-tickets" element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="Admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="showtimes" element={<AdminShowtimes />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
