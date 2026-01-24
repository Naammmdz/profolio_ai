import { WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts';

// OIDC configuration for React SPA client
export const oidcConfig: UserManagerSettings = {
  authority: import.meta.env.VITE_AUTH_SERVER_URL || 'http://localhost:9000',
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID || 'spa-client',
  redirect_uri: `${window.location.origin}/callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  response_type: 'code',
  scope: 'openid profile email read write',
  automaticSilentRenew: true,
  // Persist across browser restarts
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

