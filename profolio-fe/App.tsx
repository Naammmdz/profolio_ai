import React, { useState, useEffect } from 'react';
import Header from './components/landing/Header';
import Hero from './components/landing/Hero';
import Comparison from './components/landing/Comparison';
import Process from './components/landing/Process';
import UseCases from './components/landing/UseCases';
import Showcase from './components/landing/Showcase';
import Pricing from './components/landing/Pricing';
import Footer from './components/landing/Footer';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import PortfolioPreview from './components/portfolio/PortfolioPreview';
import { authService } from './src/services/authService';
import { oauth2Service } from './src/services/oauth2Service';

type View = 'landing' | 'auth' | 'dashboard' | 'preview';

const App: React.FC = () => {
  // Check URL query param to determine initial view
  const getInitialView = (): View => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'signup') {
      // Redirect to backend register page
      window.location.href = 'http://localhost:9000/register';
      return 'landing'; // Will redirect, so this won't be used
    }
    return 'landing';
  };

  const [currentView, setCurrentView] = useState<View>(getInitialView());

  // Update view when URL changes (e.g., when redirected from Authorization Server)
  useEffect(() => {
    const checkUrlAndUpdateView = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'signup') {
        setCurrentView('auth');
      }
    };

    // Check on mount and when URL changes
    checkUrlAndUpdateView();

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', checkUrlAndUpdateView);
    return () => window.removeEventListener('popstate', checkUrlAndUpdateView);
  }, []);

  /**
   * Handle "Get Started" / "Login" button clicks
   * Standard OAuth2 flow: Check auth status → redirect to Authorization Server if not authenticated
   */
  const handleStart = async () => {
    try {
      // Check if user is already authenticated
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        // Already authenticated → go to dashboard
        setCurrentView('dashboard');
        window.scrollTo(0, 0);
      } else {
        // Not authenticated → redirect to Authorization Server
        oauth2Service.initiateLogin();
      }
    } catch (error) {
      // If check fails, assume not authenticated → redirect to Authorization Server
      console.error('Auth check failed:', error);
      oauth2Service.initiateLogin();
    }
  };

  const handleLogin = () => {
    setCurrentView('dashboard');
    window.scrollTo(0, 0);
  };

  const handlePreview = () => {
    setCurrentView('preview');
    window.scrollTo(0, 0);
  };

  if (currentView === 'preview') {
    return <PortfolioPreview onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onPreview={handlePreview} />;
  }

  // Auth page only for signup (login redirects directly to Authorization Server)
  if (currentView === 'auth') {
    return (
      <AuthPage 
        onBack={() => setCurrentView('landing')} 
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="relative w-full">
      {/* Background Grid - Hero Only */}
      <div 
        className="absolute top-0 left-0 w-full h-[120vh] z-0 bg-grid-pattern opacity-60 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      ></div>
      
      <Header onGetStarted={handleStart} />
      
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

export default App;