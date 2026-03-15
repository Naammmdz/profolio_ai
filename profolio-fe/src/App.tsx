import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import PortfolioPreview from './components/portfolio/PortfolioPreview';
import PublicPortfolioPage from './components/portfolio/PublicPortfolioPage';
import AdminDashboard from './components/admin/AdminDashboard';
import Callback from './components/auth/Callback';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFoundPage from './components/common/NotFoundPage';

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/callback" element={<Callback />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard onPreview={() => navigate('/preview')} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/preview"
        element={
          <ProtectedRoute>
            <PortfolioPreview onBack={() => navigate('/dashboard')} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Public portfolio — no auth needed */}
      <Route path="/p/:slug" element={<PublicPortfolioPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;