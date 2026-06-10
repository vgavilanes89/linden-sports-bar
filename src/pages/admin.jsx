import React, { useEffect, useState } from 'react';
import { Users, Shield, RefreshCw, LogIn, ClipboardList, Trash2, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import EditUserModal from '../components/editusermodal';

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
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    const data = await api.getAdminUsers();
    setUsers(data.users);
    setTotalUsers(data.total);
  };

  const loadOrders = async () => {
    const data = await api.getAdminOrders();
    setOrders(data.orders);
    setTotalOrders(data.total);
  };

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      await Promise.all([loadUsers(), loadOrders()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (userId, payload) => {
    const updated = await api.updateAdminUser(userId, payload);
    setUsers((prev) => prev.map((entry) => (entry.id === userId ? updated : entry)));
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user and all of their orders? This cannot be undone.')) return;

    setDeletingUserId(userId);
    setError('');

    try {
      const result = await api.deleteAdminUser(userId);
      setUsers((prev) => prev.filter((entry) => entry.id !== userId));
      setTotalUsers((prev) => Math.max(0, prev - 1));
      if (result.ordersRemoved > 0) {
        setOrders((prev) => prev.filter((order) => order.userId !== userId));
        setTotalOrders((prev) => Math.max(0, prev - result.ordersRemoved));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;

    setDeletingOrderId(orderId);
    setError('');

    try {
      await api.deleteAdminOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setTotalOrders((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingOrderId(null);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
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
          <p className="text-zinc-400 mb-8">Sign in with an admin account to manage users and orders.</p>
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
            <p className="text-zinc-400 mt-2">Manage registered users and customer orders</p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-white font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <Users className="w-8 h-8 text-amber-500 mb-3" />
            <p className="text-3xl font-black">{totalUsers}</p>
            <p className="text-zinc-500 text-sm">Total Users</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <ClipboardList className="w-8 h-8 text-amber-500 mb-3" />
            <p className="text-3xl font-black">{totalOrders}</p>
            <p className="text-zinc-500 text-sm">Total Orders</p>
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

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveSection('users')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              activeSection === 'users'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              activeSection === 'orders'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Orders
          </button>
        </div>

        {activeSection === 'users' && (
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
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                        No users have signed in yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((entry) => (
                      <tr key={entry.id} className="border-b border-zinc-800/80 hover:bg-black/40">
                        <td className="px-6 py-4 font-semibold text-white">{entry.name}</td>
                        <td className="px-6 py-4 text-zinc-300">{entry.email || '—'}</td>
                        <td className="px-6 py-4 text-zinc-300">
                          {entry.phone || '—'}
                          {entry.phoneVerified && entry.phone && (
                            <span className="ml-2 text-[10px] uppercase text-green-500">✓</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold uppercase bg-black border border-zinc-700 px-3 py-1 rounded-full text-amber-500">
                            {PROVIDER_LABELS[entry.provider] || entry.provider}
                          </span>
                        </td>
                        <td className="px-6 py-4 capitalize text-zinc-300">{entry.role}</td>
                        <td className="px-6 py-4 text-zinc-400 text-sm">{formatDate(entry.createdAt)}</td>
                        <td className="px-6 py-4 text-zinc-400 text-sm">{formatDate(entry.lastLoginAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setEditingUser(entry)}
                              className="inline-flex items-center gap-1.5 text-amber-500 hover:text-amber-400 text-sm font-semibold"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(entry.id)}
                              disabled={deletingUserId === entry.id || entry.id === user.id}
                              className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm font-semibold"
                              title={entry.id === user.id ? 'Cannot delete your own account' : undefined}
                            >
                              <Trash2 className="w-4 h-4" />
                              {deletingUserId === entry.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wide">
                    <th className="px-6 py-4 font-semibold">Order</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Items</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Placed</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                        No orders have been placed yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-zinc-800/80 hover:bg-black/40">
                        <td className="px-6 py-4 font-mono text-sm text-amber-500">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white">{order.userName}</p>
                          <p className="text-zinc-500 text-sm">{order.userEmail || '—'}</p>
                        </td>
                        <td className="px-6 py-4 text-zinc-300 text-sm max-w-xs">
                          {order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}
                        </td>
                        <td className="px-6 py-4 text-amber-500 font-bold">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 capitalize text-zinc-300">{order.status}</td>
                        <td className="px-6 py-4 text-zinc-400 text-sm">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deletingOrderId === order.id}
                            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm font-semibold"
                          >
                            <Trash2 className="w-4 h-4" />
                            {deletingOrderId === order.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <EditUserModal
        user={editingUser}
        currentUserId={user.id}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
      />
    </div>
  );
}
