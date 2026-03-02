import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import App from './App';
import { oidcConfig } from './config/oidcConfig';
import { OidcTokenSync } from './config/OidcTokenSync';
import { OidcAuthEventsHandler } from './config/OidcAuthEventsHandler';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <OidcAuthProvider
        {...oidcConfig}
        onSigninCallback={() => {
          // Callback is automatically handled by react-oidc-context
          // This is just a hook for additional logic if needed
          console.log('Sign-in callback completed');
        }}
      >
        <OidcTokenSync />
        <OidcAuthEventsHandler />
        <App />
      </OidcAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);