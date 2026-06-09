import React, { useEffect, useState } from 'react';
import { Users, Shield, RefreshCw, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const PROVIDER_LABELS = {
  google: 'Google',
  apple: 'Apple',
  yahoo: 'Yahoo',
  email: 'Email / Phone',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function Admin({ setActiveTab, setIsAuthModalOpen }) {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.getAdminUsers();
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (authLoading) {
    return (
      <div className="bg-black min-h-screen py-16 text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-black min-h-screen py-16 text-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase mb-4">Admin Dashboard</h2>
          <p className="text-zinc-400 mb-8">Sign in with an admin account to view registered users.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-full inline-flex items-center gap-2"
          >
            <LogIn className="w-5 h-5" /> Log In
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-black min-h-screen py-16 text-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase mb-4">Access Denied</h2>
          <p className="text-zinc-400 mb-8">
            Your account does not have admin privileges. Contact the restaurant owner to get access.
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-3 rounded-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-black uppercase">
              Admin <span className="text-amber-500">Dashboard</span>
            </h2>
            <p className="text-zinc-400 mt-2">Registered users and login activity</p>
          </div>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-white font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <Users className="w-8 h-8 text-amber-500 mb-3" />
            <p className="text-3xl font-black">{total}</p>
            <p className="text-zinc-500 text-sm">Total Users</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-3xl font-black">
              {users.filter((entry) => entry.provider === 'google').length}
            </p>
            <p className="text-zinc-500 text-sm">Google Sign-ins</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-3xl font-black">
              {users.filter((entry) => entry.provider === 'email').length}
            </p>
            <p className="text-zinc-500 text-sm">Email / Phone Sign-ins</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-300 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wide">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Provider</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                      No users have signed in yet.
                    </td>
                  </tr>
                ) : (
                  users.map((entry) => (
                    <tr key={entry.id} className="border-b border-zinc-800/80 hover:bg-black/40">
                      <td className="px-6 py-4 font-semibold text-white">{entry.name}</td>
                      <td className="px-6 py-4 text-zinc-300">{entry.email || '—'}</td>
                      <td className="px-6 py-4 text-zinc-300">{entry.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold uppercase bg-black border border-zinc-700 px-3 py-1 rounded-full text-amber-500">
                          {PROVIDER_LABELS[entry.provider] || entry.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 capitalize text-zinc-300">{entry.role}</td>
                      <td className="px-6 py-4 text-zinc-400 text-sm">{formatDate(entry.createdAt)}</td>
                      <td className="px-6 py-4 text-zinc-400 text-sm">{formatDate(entry.lastLoginAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
