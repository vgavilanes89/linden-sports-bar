import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
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

export default function Account({ setActiveTab, setIsAuthModalOpen }) {
  const { user, needsPhone, updatePhone } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.phone) {
      setPhone(formatPhoneDisplay(user.phone));
    }
  }, [user]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updatePhone(phone);
      setSuccess(user.phone ? 'Phone number updated.' : 'Phone number saved. You can now place orders.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-16 text-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-amber-500 uppercase">My Account</h2>
          <p className="text-zinc-400 mt-2">Manage your profile and contact information.</p>
        </div>

        {needsPhone && (
          <div className="mb-6 flex gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-500 font-semibold text-sm">Phone number required</p>
              <p className="text-zinc-400 text-sm mt-1">
                Add your phone below to place orders and receive pickup updates.
              </p>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4">Profile</h3>
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
            </dl>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-500" />
              Phone number
              {user.phone && (
                <CheckCircle2 className="w-4 h-4 text-green-500" aria-label="Phone on file" />
              )}
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              {user.phone
                ? 'Update your number if it has changed.'
                : 'Required for all accounts — especially Google and Apple sign-in.'}
            </p>

            <div className="relative mb-4">
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

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Saving...' : user.phone ? 'Update Phone' : 'Save Phone Number'}
            </button>
          </form>
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
