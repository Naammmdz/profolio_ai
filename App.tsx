import React, { useState } from 'react';
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

type View = 'landing' | 'auth' | 'dashboard' | 'preview';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');

  const handleStart = () => {
    setCurrentView('auth');
    window.scrollTo(0, 0);
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