import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { oidcConfig } from './config/oidcConfig';
import { OidcTokenSync } from './config/OidcTokenSync';
import { OidcAuthEventsHandler } from './config/OidcAuthEventsHandler';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
      <QueryClientProvider client={queryClient}>
        <OidcAuthProvider
          {...oidcConfig}
          onSigninCallback={() => {
            console.log('Sign-in callback completed');
          }}
        >
          <OidcTokenSync />
          <OidcAuthEventsHandler />
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--surface)',
                color: 'var(--primary)',
                border: '1px solid var(--border)',
                fontSize: '14px',
              },
            }}
          />
        </OidcAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);