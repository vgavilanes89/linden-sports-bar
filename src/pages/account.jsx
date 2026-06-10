import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Lock,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PROVIDER_LABELS = {
  google: 'Google',
  apple: 'Apple',
  email: 'Email & Password',
};

const inputClassName =
  'w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors';

function formatPhoneDisplay(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function normalizePhoneInput(value) {
  return value.replace(/\D/g, '');
}

export default function Account({ setActiveTab, setIsAuthModalOpen }) {
  const { user, needsPhone, sendPhoneVerificationCode, verifyPhone } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devCode, setDevCode] = useState('');

  const startEditing = () => {
    setIsEditing(true);
    setStep('phone');
    setPhone(user?.phone ? formatPhoneDisplay(user.phone) : '');
    setCode('');
    setError('');
    setSuccess('');
    setDevCode('');
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setStep('phone');
    setPhone('');
    setCode('');
    setError('');
    setSuccess('');
    setDevCode('');
  };

  if (!user) {
    return (
      <div className="bg-zinc-950 min-h-screen py-16 text-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <User className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase mb-4">My Account</h2>
          <p className="text-zinc-400 mb-8">Sign in to manage your profile and phone number.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const handleSendCode = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setDevCode('');

    try {
      const result = await sendPhoneVerificationCode(phone);
      setStep('code');
      setSuccess(result.message || 'Verification code sent.');
      if (result.devCode) {
        setDevCode(result.devCode);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await verifyPhone(phone, code);
      setSuccess('Phone number verified and saved.');
      setIsEditing(false);
      setStep('phone');
      setCode('');
      setDevCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showEditForm = isEditing || needsPhone;

  return (
    <div className="bg-zinc-950 min-h-screen py-16 text-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-black text-amber-500 uppercase">My Account</h2>
            <p className="text-zinc-400 mt-2">Your profile and verified contact information.</p>
          </div>
          {user.phoneVerified && !showEditForm && (
            <button
              onClick={startEditing}
              className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {needsPhone && !showEditForm && (
          <div className="mb-6 flex gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-500 font-semibold text-sm">Phone verification required</p>
              <p className="text-zinc-400 text-sm mt-1">
                Add and verify your phone number to place orders.
              </p>
              <button
                onClick={startEditing}
                className="text-amber-500 font-bold text-sm mt-2 underline hover:text-amber-400"
              >
                Add phone number
              </button>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Profile</h3>
              {showEditForm && user.phoneVerified && (
                <button
                  onClick={cancelEditing}
                  className="text-zinc-500 hover:text-white flex items-center gap-1 text-sm"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>
            <dl className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">Full name</dt>
                  <dd className="text-white font-medium mt-0.5">{user.name}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">Email</dt>
                  <dd className="text-white font-medium mt-0.5">{user.email || '—'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">Sign-in method</dt>
                  <dd className="text-white font-medium mt-0.5">
                    {PROVIDER_LABELS[user.provider] || user.provider}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">Phone</dt>
                  {user.phoneVerified && user.phone ? (
                    <dd className="text-white font-medium mt-0.5 flex items-center gap-2">
                      {formatPhoneDisplay(user.phone)}
                      <span className="inline-flex items-center gap-1 text-xs text-green-500 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                      <Lock className="w-3.5 h-3.5 text-zinc-600" aria-label="Locked" />
                    </dd>
                  ) : (
                    <dd className="text-zinc-500 font-medium mt-0.5">Not verified yet</dd>
                  )}
                </div>
              </div>
            </dl>
          </div>

          {showEditForm && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-1">
                {user.phoneVerified ? 'Change phone number' : 'Add phone number'}
              </h3>
              <p className="text-zinc-500 text-sm mb-4">
                We will text you a verification code. Your number is locked after verification.
              </p>

              {step === 'phone' ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className={`${inputClassName} pl-11`}
                      autoComplete="tel"
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  {success && <p className="text-green-400 text-sm">{success}</p>}

                  <button
                    type="submit"
                    disabled={loading || normalizePhoneInput(phone).length < 10}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors"
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-4">
                  <p className="text-sm text-zinc-400">
                    Enter the 6-digit code sent to{' '}
                    <span className="text-white font-medium">{formatPhoneDisplay(phone)}</span>
                  </p>

                  {devCode && (
                    <p className="text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-amber-500">
                      Dev mode code: <span className="font-mono font-bold">{devCode}</span>
                    </p>
                  )}

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className={`${inputClassName} text-center text-2xl tracking-[0.4em] font-mono`}
                    autoComplete="one-time-code"
                  />

                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  {success && <p className="text-green-400 text-sm">{success}</p>}

                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors"
                  >
                    {loading ? 'Verifying...' : 'Verify & Save Phone'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setCode('');
                      setError('');
                      setSuccess('');
                      setDevCode('');
                    }}
                    className="w-full text-zinc-500 hover:text-zinc-300 text-sm py-2"
                  >
                    Use a different number
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setActiveTab('orders')}
          className="text-amber-500 hover:text-amber-400 text-sm font-semibold transition-colors"
        >
          View my orders →
        </button>
      </div>
    </div>
  );
}
