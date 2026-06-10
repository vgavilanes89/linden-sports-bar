import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!api.getToken()) {
        if (active) setLoading(false);
        return;
      }

      try {
        const data = await api.getMe();
        if (active) setUser(data.user);
      } catch {
        api.logout();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'admin',
      async loginWithEmailPhone(payload) {
        const loggedInUser = await api.loginWithEmailPhone(payload);
        setUser(loggedInUser);
        return loggedInUser;
      },
      async loginWithSocial(payload) {
        const loggedInUser = await api.loginWithSocial(payload);
        setUser(loggedInUser);
        return loggedInUser;
      },
      async loginWithGoogle(credential) {
        const loggedInUser = await api.loginWithGoogle(credential);
        setUser(loggedInUser);
        return loggedInUser;
      },
      async loginWithApple(payload) {
        const loggedInUser = await api.loginWithApple(payload);
        setUser(loggedInUser);
        return loggedInUser;
      },
      logout() {
        api.logout();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
