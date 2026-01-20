import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Hero from './Hero';
import Comparison from './Comparison';
import Process from './Process';
import UseCases from './UseCases';
import Showcase from './Showcase';
import Pricing from './Pricing';
import Footer from './Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import { oauth2Service } from '../../src/services/oauth2Service';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, authLoading, logout } = useAuth();

  const handleStart = () => {
    if (authLoading) return;
    if (user) {
      navigate('/dashboard');
      return;
    }
    oauth2Service.initiateLogin();
  };

  return (
    <div className="relative w-full">
      {/* Background Grid - Hero Only */}
      <div
        className="absolute top-0 left-0 w-full h-[120vh] z-0 bg-grid-pattern opacity-60 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      ></div>

      <Header
        onGetStarted={handleStart}
        isAuthenticated={!!user}
        userEmail={user?.email || user?.username || user?.name}
        onGoDashboard={() => navigate('/dashboard')}
        onLogout={async () => {
          await logout();
          navigate('/');
        }}
      />

      <main className="relative z-10">
        <Hero onStart={handleStart} />
        <Comparison />
        <Process />
        <UseCases />
        <Showcase />
        <Pricing />
      </main>

      <Footer onStart={handleStart} />
    </div>
  );
};

export default LandingPage;

