-- Disable PKCE requirement for auth-code-client (for easier testing)
-- In production, PKCE should be enabled for better security

-- Delete existing client and let ClientInitializer recreate with PKCE disabled
DELETE FROM oauth2_registered_client WHERE client_id = 'auth-code-client';
