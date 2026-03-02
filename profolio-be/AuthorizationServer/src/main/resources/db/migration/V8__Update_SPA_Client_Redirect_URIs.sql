-- Update spa-client redirect URIs to support deployment behind reverse proxy
-- Delete existing spa-client so ClientInitializer will recreate it with
-- configurable redirect URIs from environment variables (SPA_REDIRECT_URIS, SPA_POST_LOGOUT_REDIRECT_URIS)
DELETE FROM oauth2_authorization WHERE registered_client_id IN (
    SELECT id FROM oauth2_registered_client WHERE client_id = 'spa-client'
);
DELETE FROM oauth2_authorization_consent WHERE registered_client_id IN (
    SELECT id FROM oauth2_registered_client WHERE client_id = 'spa-client'
);
DELETE FROM oauth2_registered_client WHERE client_id = 'spa-client';
