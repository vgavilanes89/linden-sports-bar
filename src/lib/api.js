const API_BASE = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('linden_auth_token');
}

function setToken(token) {
  if (token) {
    localStorage.setItem('linden_auth_token', token);
  } else {
    localStorage.removeItem('linden_auth_token');
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data;
}

export const api = {
  getToken,
  setToken,

  async getMe() {
    return request('/api/auth/me');
  },

  async loginWithEmailPhone(payload) {
    const data = await request('/api/auth/email-phone', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setToken(data.token);
    return data.user;
  },

  async loginWithSocial(payload) {
    const data = await request('/api/auth/social', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setToken(data.token);
    return data.user;
  },

  async loginWithGoogle(credential) {
    const data = await request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    setToken(data.token);
    return data.user;
  },

  async getAdminUsers() {
    return request('/api/admin/users');
  },

  logout() {
    setToken(null);
  },
};

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
