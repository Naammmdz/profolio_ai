let accessToken: string | null = null;

export const authTokenStore = {
  setToken(token: string | null) {
    accessToken = token;
  },
  getToken(): string | null {
    return accessToken;
  },
};

