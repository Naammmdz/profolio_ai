import React, { useEffect, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import { AUTH_LOGIN_REQUIRED_EVENT } from './authEvents';

export const OidcAuthEventsHandler: React.FC = () => {
  const auth = useAuth();
  const redirectingRef = useRef(false);

  useEffect(() => {
    const onLoginRequired = () => {
      if (redirectingRef.current) return;
      redirectingRef.current = true;
      auth.signinRedirect();
    };

    window.addEventListener(AUTH_LOGIN_REQUIRED_EVENT, onLoginRequired);
    return () => window.removeEventListener(AUTH_LOGIN_REQUIRED_EVENT, onLoginRequired);
  }, [auth]);

  return null;
};

