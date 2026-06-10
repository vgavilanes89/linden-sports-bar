import React, { useState } from 'react';
import {
  X,
  Apple,
  Mail,
  Phone,
  User,
  Loader2,
  ChevronLeft,
  Lock,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';
import { useAuth } from '../context/AuthContext';
import { useOAuthConfig } from '../context/OAuthConfigContext';

const inputClassName =
  'w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors';

export default function AuthModal({ isAuthModalOpen, setIsAuthModalOpen }) {
  const { register, loginWithEmailPassword, loginWithGoogle, loginWithApple } = useAuth();
  const { googleClientId, appleClientId } = useOAuthConfig();
  const [mode, setMode] = useState('main');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const closeModal = () => {
    setIsAuthModalOpen(false);
    setMode('main');
    resetForm();
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await register({ name, email, phone, password });
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginWithEmailPassword({ email, password });
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

  const handleAppleSuccess = async (response) => {
    setLoading(true);
    setError('');

    try {
      await loginWithApple({
        identityToken: response.authorization.id_token,
        user: response.user,
      });
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  const hasSocialLogin = googleClientId || appleClientId;
  const title =
    mode === 'signup' ? 'Create Account' : mode === 'login' ? 'Log In' : 'Welcome';

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
          <h2 className="text-3xl font-black text-white uppercase mb-2">{title}</h2>
          <p className="text-zinc-400">
            {mode === 'signup'
              ? 'Set up your account with your name, email, and phone.'
              : mode === 'login'
                ? 'Sign in with your email and password.'
                : 'Create an account or sign in to checkout and save your orders.'}
          </p>
        </div>

        {mode === 'main' && (
          <div className="space-y-4">
            {googleClientId ? (
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
              <p className="text-xs text-zinc-500 text-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                Google sign-in is not configured yet.
              </p>
            )}

            {appleClientId ? (
              <AppleSignin
                authOptions={{
                  clientId: appleClientId,
                  scope: 'email name',
                  redirectURI: window.location.origin,
                  usePopup: true,
                }}
                uiType="dark"
                onSuccess={handleAppleSuccess}
                onError={(err) => setError(err?.error || 'Apple sign-in was cancelled or failed.')}
                render={(props) => (
                  <button
                    type="button"
                    {...props}
                    disabled={loading || props.disabled}
                    className="w-full bg-black text-white border border-zinc-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-900 transition-colors disabled:opacity-60"
                  >
                    <Apple className="w-5 h-5" fill="currentColor" />
                    Continue with Apple
                  </button>
                )}
              />
            ) : (
              <p className="text-xs text-zinc-500 text-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                Apple sign-in is not configured yet.
              </p>
            )}

            {hasSocialLogin && (
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-2 text-zinc-500">or</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => switchMode('signup')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Create Account with Email
            </button>

            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full border border-amber-500/40 text-amber-500 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-amber-500/10 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Log In with Email
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            {loading && (
              <p className="text-zinc-400 text-sm text-center flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Please wait...
              </p>
            )}
          </div>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <button
              type="button"
              onClick={() => switchMode('main')}
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
                required
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
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className={`${inputClassName} pl-11`}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 8 characters)"
                className={`${inputClassName} pl-11`}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={`${inputClassName} pl-11`}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-amber-500 hover:text-amber-400 font-semibold"
              >
                Log in
              </button>
            </p>
          </form>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <button
              type="button"
              onClick={() => switchMode('main')}
              className="flex items-center gap-2 text-zinc-400 hover:text-amber-500 text-sm mb-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className={`${inputClassName} pl-11`}
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`${inputClassName} pl-11`}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>

            <p className="text-center text-sm text-zinc-500">
              Need an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-amber-500 hover:text-amber-400 font-semibold"
              >
                Sign up
              </button>
            </p>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-zinc-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
