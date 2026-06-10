import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { OAuthConfigProvider, useOAuthConfig } from './context/OAuthConfigContext.jsx';
import './index.css';

function AppTree() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

function AppWithOAuth() {
  const { googleClientId, loading } = useOAuthConfig();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!googleClientId) {
    return <AppTree />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppTree />
    </GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OAuthConfigProvider>
      <AppWithOAuth />
    </OAuthConfigProvider>
  </React.StrictMode>
);
