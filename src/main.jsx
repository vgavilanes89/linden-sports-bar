import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { GOOGLE_CLIENT_ID } from './lib/api.js';
import './index.css';

function Root() {
  const app = (
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  return GOOGLE_CLIENT_ID ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{app}</GoogleOAuthProvider>
  ) : (
    app
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
