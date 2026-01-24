export const AUTH_LOGIN_REQUIRED_EVENT = 'auth:login-required';

export function emitLoginRequired() {
  window.dispatchEvent(new Event(AUTH_LOGIN_REQUIRED_EVENT));
}

