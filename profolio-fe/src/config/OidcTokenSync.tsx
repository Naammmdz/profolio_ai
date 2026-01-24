import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { authTokenStore } from './authTokenStore';

/**
 * Sync OIDC access token from react-oidc-context into a simple in-memory store
 * so non-React modules (like Axios interceptors) can read it.
 */
export const OidcTokenSync: React.FC = () => {
  const auth = useAuth();

  useEffect(() => {
    authTokenStore.setToken(auth.user?.access_token ?? null);
  }, [auth.user]);

  return null;
};

