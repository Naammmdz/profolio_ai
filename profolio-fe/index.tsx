import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import App from './App';
import { oidcConfig } from './src/config/oidcConfig';
import { OidcTokenSync } from './src/config/OidcTokenSync';
import { OidcAuthEventsHandler } from './src/config/OidcAuthEventsHandler';

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
      <OidcAuthProvider {...oidcConfig}>
        <OidcTokenSync />
        <OidcAuthEventsHandler />
        <App />
      </OidcAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);