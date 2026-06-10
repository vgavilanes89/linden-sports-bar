import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const OAuthConfigContext = createContext({
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  appleClientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
  loading: true,
});

export function OAuthConfigProvider({ children }) {
  const [config, setConfig] = useState({
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    appleClientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
    loading: true,
  });

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      try {
        const response = await fetch('/api/config/public');
        if (!response.ok) return;
        const data = await response.json();
        if (!active) return;

        setConfig({
          googleClientId: data.googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          appleClientId: data.appleClientId || import.meta.env.VITE_APPLE_CLIENT_ID || '',
          loading: false,
        });
      } catch {
        if (active) {
          setConfig((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    loadConfig();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      googleClientId: config.googleClientId,
      appleClientId: config.appleClientId,
      loading: config.loading,
    }),
    [config]
  );

  return <OAuthConfigContext.Provider value={value}>{children}</OAuthConfigContext.Provider>;
}

export function useOAuthConfig() {
  return useContext(OAuthConfigContext);
}
