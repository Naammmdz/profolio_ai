import React from 'react';
import { useAuth } from 'react-oidc-context';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-xs font-mono text-text-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const didAutoLogin = React.useRef(false);

  React.useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && !didAutoLogin.current) {
      didAutoLogin.current = true;
      // Start OIDC redirect login
      auth.signinRedirect();
    }
  }, [auth]);

  if (auth.isLoading || !auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-xs font-mono text-text-muted">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

