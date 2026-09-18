import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import CustomerLayout from './layouts/CustomerLayout'
import DashboardHome from './pages/admin/DashboardHome'
import AdminMovies from './pages/admin/AdminMovies'
import AdminShowtimes from './pages/admin/AdminShowtimes'
import AdminMessages from './pages/admin/AdminMessages'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRouteGuard from './components/AdminRouteGuard'
import Login from './pages/auth/Login'
import AdminLogin from './pages/auth/AdminLogin'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Home from './pages/customer/Home'
import MovieDetails from './pages/customer/MovieDetails'
import SeatSelection from './pages/customer/SeatSelection'
import Checkout from './pages/customer/Checkout'
import UserBookingHistory from './pages/customer/UserBookingHistory'
import MyProfile from './pages/customer/MyProfile'
import EditProfile from './pages/customer/EditProfile'
import ChangePassword from './pages/customer/ChangePassword'
import MyTickets from './pages/customer/MyTickets'
import LoyaltyHistory from './pages/customer/LoyaltyHistory'
import PrivacyPolicy from './pages/customer/PrivacyPolicy'
import TermsOfService from './pages/customer/TermsOfService'
import NotFound from './pages/customer/NotFound'
import PreferencesWidget from './components/PreferencesWidget'
import RefundPolicy from './pages/customer/RefundPolicy'
import ContactUs from './pages/customer/ContactUs'

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
          
          <Route path="booking-history" element={
            <ProtectedRoute>
              <UserBookingHistory />
            </ProtectedRoute>
          } />
          
          <Route path="my-profile" element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          } />
          
          <Route path="loyalty-history" element={
            <ProtectedRoute>
              <LoyaltyHistory />
            </ProtectedRoute>
          } />

          <Route path="edit-profile" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />

          <Route path="profile/password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
          
          <Route path="tickets" element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          } />
          
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="refund-policy" element={<RefundPolicy />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/k-subedi-08/login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Admin Routes */}
        <Route path="/k-subedi-08" element={
          <AdminRouteGuard>
            <AdminLayout />
          </AdminRouteGuard>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="showtimes" element={<AdminShowtimes />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
      <PreferencesWidget />
    </AuthProvider>
  )
}

export default App
