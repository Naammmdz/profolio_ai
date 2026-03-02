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
import { useAuth } from 'react-oidc-context';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleStart = () => {
    if (auth.isLoading) return;
    if (auth.isAuthenticated) {
      navigate('/dashboard');
      return;
    }
    auth.signinRedirect();
  };

  return (
    <div className="relative w-full bg-background text-primary">
      {/* Background Grid - Hero Only */}
      <div
        className="absolute top-0 left-0 w-full h-[120vh] z-0 opacity-60 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      ></div>

      <Header
        onGetStarted={handleStart}
        isAuthenticated={auth.isAuthenticated}
        userEmail={auth.user?.profile?.email || auth.user?.profile?.preferred_username || auth.user?.profile?.name}
        onGoDashboard={() => navigate('/dashboard')}
        onLogout={async () => {
          await auth.signoutRedirect();
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

