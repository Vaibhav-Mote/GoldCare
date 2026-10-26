import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Shops from './pages/Shops';
import Booking from './pages/Booking';
import TrackBooking from './pages/TrackBooking';
import AdminLogin from './pages/AdminLogin';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ShopManagement from './pages/ShopManagement';
import BookingManagement from './pages/BookingManagement';
import CustomerManagement from './pages/CustomerManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import { initializeDemoData } from './services/bookingService';

export default function App() {
  useEffect(() => {
    // Seed initial demo shops & bookings into LocalStorage if not present
    initializeDemoData();
  }, []);

  return (
    <Routes>
      {/* Public Pages with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/track" element={<TrackBooking />} />
      </Route>

      {/* Admin Login (Standalone) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Pages with AdminLayout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="shops" element={<ShopManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
