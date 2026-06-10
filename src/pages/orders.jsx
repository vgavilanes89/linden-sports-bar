import React, { useCallback, useEffect, useState } from 'react';
import { ClipboardList, Package, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../lib/orders';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function Orders({ setActiveTab, setIsAuthModalOpen }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user, loadOrders]);

  if (!user) {
    return (
      <div className="bg-zinc-950 min-h-screen py-16 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ClipboardList className="w-16 h-16 text-amber-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-black text-white uppercase mb-4">My Orders</h2>
          <p className="text-zinc-400 mb-8">Sign in to view your order history and track pickups.</p>
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

  return (
    <div className="bg-zinc-950 min-h-screen py-16 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-amber-500 uppercase flex items-center gap-3">
            <ClipboardList className="w-10 h-10" /> My Orders
          </h2>
          <p className="text-zinc-400 mt-2">
            Order history for {user.name}
            {user.email ? ` · ${user.email}` : ''}
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-300 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-zinc-500 py-16 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
            <Package className="w-14 h-14 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
            <p className="text-zinc-400 mb-6">Browse the menu and place your first order for pickup.</p>
            <button
              onClick={() => setActiveTab('menu')}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
            >
              View Menu <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-zinc-800">
                  <div>
                    <p className="text-white font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-zinc-500 text-sm mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-xs font-bold uppercase tracking-wide bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/30">
                      {order.status}
                    </span>
                    <p className="text-amber-500 font-bold text-lg mt-1">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <ul className="p-5 space-y-3">
                  {order.items.map((item, index) => (
                    <li key={`${order.id}-${item.id}-${index}`}>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-300">
                          {item.quantity}× {item.name}
                        </span>
                        <span className="text-zinc-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {item.comment && (
                        <p className="mt-1 text-xs text-zinc-500 italic">
                          Note: {item.comment}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="px-5 pb-5 flex justify-between text-sm text-zinc-500 border-t border-zinc-800 pt-4 mx-5">
                  <span>Subtotal ${order.subtotal.toFixed(2)} · Tax ${order.tax.toFixed(2)}</span>
                  <span className="text-white font-medium">Pickup</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
