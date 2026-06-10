import React, { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const inputClassName =
  'w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors';

export default function PhoneRequiredModal() {
  const { user, needsPhone, updatePhone, logout } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!needsPhone || !user) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updatePhone(phone);
      setPhone('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <div className="relative bg-zinc-950 border border-amber-500/30 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase mb-2">Phone Required</h2>
          <p className="text-zinc-400 text-sm">
            Hi {user.name.split(' ')[0]} — add your phone number to place orders and receive updates
            about your pickup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className={`${inputClassName} pl-11`}
              autoComplete="tel"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full text-zinc-500 hover:text-zinc-300 text-sm py-2 transition-colors"
          >
            Sign out and use a different account
          </button>
        </form>
      </div>
    </div>
  );
}
