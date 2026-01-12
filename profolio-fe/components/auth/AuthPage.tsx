import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

interface AuthPageProps {
  onBack: () => void;
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleSwitchToSignUp = () => {
    setActiveTab('signup');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

  if (activeTab === 'login') {
    return (
      <Login
        onBack={onBack}
        onLogin={onLogin}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
    );
  }

  return (
    <SignUp
      onBack={onBack}
      onLogin={onLogin}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
};

export default AuthPage;