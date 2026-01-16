import { LoginResponse } from '../types/api';

/**
 * OAuth2 Authorization Code Flow Service
 * Handles OAuth2 standard flow with Authorization Server
 */

const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || 'auth-code-client';
const REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT_URI || `${window.location.origin}/callback`;
const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL || 'http://localhost:9000';
const GATEWAY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const oauth2Service = {
  /**
   * Step 1: Redirect user to Authorization Server
   * This will show the login form on the Authorization Server
   */
  initiateLogin(): void {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email',
      state: this.generateState(), // CSRF protection
    });

    // Store state in sessionStorage for verification
    sessionStorage.setItem('oauth2_state', params.get('state')!);

    // Redirect to Authorization Server
    window.location.href = `${AUTH_SERVER_URL}/oauth2/authorize?${params.toString()}`;
  },

  /**
   * Step 2: Handle callback from Authorization Server
   * Called when user is redirected back with authorization code
   */
  async handleCallback(): Promise<LoginResponse | null> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    // Check for errors
    if (error) {
      console.error('OAuth2 error:', error);
      throw new Error(`OAuth2 authorization failed: ${error}`);
    }

    // Verify state (CSRF protection)
    const storedState = sessionStorage.getItem('oauth2_state');
    if (!state || state !== storedState) {
      throw new Error('Invalid state parameter. Possible CSRF attack.');
    }

    // Clean up state
    sessionStorage.removeItem('oauth2_state');

    if (!code) {
      throw new Error('Authorization code not found');
    }

    // Step 3: Exchange code for token
    return await this.exchangeCodeForToken(code);
  },

  /**
   * Step 3: Exchange authorization code for tokens
   * BFF pattern: Tokens are stored server-side, only HttpOnly cookie is set
   * Frontend does NOT receive or store tokens
   */
  async exchangeCodeForToken(code: string): Promise<LoginResponse> {
    try {
      // Call BFF endpoint which securely exchanges code and sets HttpOnly cookie
      const response = await fetch(`${GATEWAY_URL}/auth/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ⭐ Important: Include cookies
        body: JSON.stringify({
          code: code,
          redirectUri: REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to exchange code for token');
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to exchange code for token');
      }

      // ⭐ NO TOKENS IN RESPONSE - Only user info
      // Cookie is set automatically by browser (HttpOnly)
      const { user } = result.data;

      return {
        token: '', // ⭐ Token is NOT returned - stored server-side
        refreshToken: '', // ⭐ Refresh token is NOT returned
        user: {
          id: user.id.toString(),
          email: user.email,
          roles: user.roles || [],
        },
        expiresIn: 3600, // Default
      };
    } catch (error) {
      console.error('Token exchange failed:', error);
      throw error;
    }
  },

  /**
   * Get user info from BFF endpoint
   * Uses HttpOnly cookie (no token needed)
   */
  async getUserInfo(): Promise<any> {
    try {
      const response = await fetch(`${GATEWAY_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include', // ⭐ Include HttpOnly cookie
      });

      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw error;
    }
  },

  /**
   * Decode JWT token to get user info (fallback)
   */
  decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return {};
    }
  },

  /**
   * Generate random state for CSRF protection
   */
  generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Refresh access token using refresh token
   * Note: This should also be handled by backend endpoint for security
   * For now, keeping direct call but should be moved to backend
   */
  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      // TODO: Create backend endpoint for refresh token
      // For now, calling OAuth2 endpoint directly
      const response = await fetch(`${AUTH_SERVER_URL}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: CLIENT_ID,
          // Note: Client secret should be handled by backend
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const tokenData = await response.json();
      localStorage.setItem('auth_token', tokenData.access_token);
      if (tokenData.refresh_token) {
        localStorage.setItem('refresh_token', tokenData.refresh_token);
      }

      // Note: Refresh token should also be handled by BFF
      // For now, keeping direct call but should be moved to BFF
      const userInfo = await this.getUserInfo();

      return {
        token: '', // ⭐ Not returned in BFF pattern
        refreshToken: '', // ⭐ Not returned in BFF pattern
        user: userInfo,
        expiresIn: 3600,
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  },
};
