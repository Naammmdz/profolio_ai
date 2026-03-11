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
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" as const }
};

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

      <main className="relative z-10 overflow-hidden">
        <Hero onStart={handleStart} />

        <motion.div {...fadeInUp}>
          <Comparison />
        </motion.div>

        <motion.div {...fadeInUp}>
          <Process />
        </motion.div>

        <motion.div {...fadeInUp}>
          <UseCases />
        </motion.div>

        <motion.div {...fadeInUp}>
          <Showcase />
        </motion.div>

        <motion.div {...fadeInUp}>
          <Pricing />
        </motion.div>
      </main>

      <Footer onStart={handleStart} />
    </div>
  );
};

export default LandingPage;
