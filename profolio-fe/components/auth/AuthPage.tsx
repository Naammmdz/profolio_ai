import React, { useEffect } from 'react';

interface AuthPageProps {
  onBack: () => void;
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLogin }) => {
  // Redirect to backend register page
  useEffect(() => {
    window.location.href = 'http://localhost:9000/register';
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Redirecting to register page...</p>
    </div>
  );
};

export default AuthPage;