import React, { useState } from 'react';
import { X, Apple, Mail, Phone, User, Loader2, ChevronLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_CLIENT_ID } from '../lib/api';

const inputClassName =
  'w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors';

function SocialProfileForm({ provider, providerLabel, onBack, onSubmit, loading, error }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ provider, name, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-amber-500 text-sm mb-2"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <p className="text-zinc-400 text-sm">
        Complete your {providerLabel} sign-in with your name and contact info.
      </p>

      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className={inputClassName}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className={inputClassName}
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number (optional if email provided)"
        className={inputClassName}
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Signing in...' : `Continue with ${providerLabel}`}
      </button>
    </form>
  );
}

export default function AuthModal({ isAuthModalOpen, setIsAuthModalOpen }) {
  const { loginWithEmailPhone, loginWithSocial, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState('main');
  const [socialProvider, setSocialProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const closeModal = () => {
    setIsAuthModalOpen(false);
    setMode('main');
    setSocialProvider(null);
    setError('');
    setName('');
    setEmail('');
    setPhone('');
  };

  const handleEmailPhoneLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginWithEmailPhone({ name, email, phone });
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (payload) => {
    setLoading(true);
    setError('');

    try {
      await loginWithSocial(payload);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle(response.credential);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative bg-zinc-950 border border-amber-500/30 rounded-2xl w-full max-w-md p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white uppercase mb-2">Log In</h2>
          <p className="text-zinc-400">Sign in to save your order history and pay quickly.</p>
        </div>

        {mode === 'main' && (
          <div className="space-y-4">
            {GOOGLE_CLIENT_ID ? (
              <div className="flex justify-center [&>div]:w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google sign-in was cancelled or failed.')}
                  theme="filled_black"
                  size="large"
                  width="100%"
                  text="continue_with"
                  shape="pill"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSocialProvider('google');
                  setMode('social');
                }}
                className="w-full bg-white text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors"
              >
                Continue with Google
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSocialProvider('apple');
                setMode('social');
              }}
              className="w-full bg-black text-white border border-zinc-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-900 transition-colors"
            >
              <Apple className="w-5 h-5" fill="currentColor" />
              Continue with Apple
            </button>

            <button
              type="button"
              onClick={() => {
                setSocialProvider('yahoo');
                setMode('social');
              }}
              className="w-full bg-[#6001D2] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#4a00a3] transition-colors"
            >
              <Mail className="w-5 h-5" />
              Continue with Yahoo
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-500">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMode('email')}
              className="w-full border border-amber-500/40 text-amber-500 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-amber-500/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Continue with Email or Phone
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            {loading && (
              <p className="text-zinc-400 text-sm text-center flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </p>
            )}
          </div>
        )}

        {mode === 'email' && (
          <form onSubmit={handleEmailPhoneLogin} className="space-y-4">
            <button
              type="button"
              onClick={() => setMode('main')}
              className="flex items-center gap-2 text-zinc-400 hover:text-amber-500 text-sm mb-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className={`${inputClassName} pl-11`}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className={`${inputClassName} pl-11`}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className={`${inputClassName} pl-11`}
              />
            </div>

            <p className="text-xs text-zinc-500">Provide at least an email or phone number.</p>
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {mode === 'social' && socialProvider && (
          <SocialProfileForm
            provider={socialProvider}
            providerLabel={
              { google: 'Google', apple: 'Apple', yahoo: 'Yahoo' }[socialProvider] || socialProvider
            }
            onBack={() => {
              setMode('main');
              setSocialProvider(null);
              setError('');
            }}
            onSubmit={handleSocialLogin}
            loading={loading}
            error={error}
          />
        )}

        <div className="mt-8 text-center text-sm text-zinc-500">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
