import React from 'react';
import { ShoppingCart, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Cart({
  isCartOpen,
  setIsCartOpen,
  cart,
  removeFromCart,
  updateQuantity,
  cartTotal,
  setIsAuthModalOpen,
  setActiveTab,
  onPlaceOrder,
  orderPlacing,
}) {
  const { user, needsPhone } = useAuth();
  return (
    <div className={`fixed inset-0 z-[60] flex justify-end ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className={`relative w-full max-w-md bg-zinc-950 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-amber-500/20`}>
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="text-amber-500" /> Your Order
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-zinc-500 mt-10">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <div className="flex-1">
                  <h4 className="font-bold text-white">{item.name}</h4>
                  <div className="text-amber-500 font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-3 bg-black px-2 py-1 rounded-lg border border-zinc-800">
                  <button onClick={() => updateQuantity(item.id, -1)} className="text-zinc-400 hover:text-amber-500 px-2 font-bold">-</button>
                  <span className="text-white font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="text-zinc-400 hover:text-amber-500 px-2 font-bold">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="ml-4 text-zinc-600 hover:text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-black">
            <div className="flex justify-between text-zinc-400 mb-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400 mb-4">
              <span>Taxes (Estimated)</span>
              <span>${(cartTotal * 0.0662).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white text-xl font-bold mb-6">
              <span>Total</span>
              <span className="text-amber-500">${(cartTotal * 1.0662).toFixed(2)}</span>
            </div>
            <button 
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-colors"
              disabled={orderPlacing}
              onClick={() => {
                if (!user) {
                  setIsCartOpen(false);
                  setIsAuthModalOpen(true);
                } else if (needsPhone) {
                  setIsCartOpen(false);
                  setActiveTab('account');
                } else {
                  onPlaceOrder(user);
                }
              }}
            >
              {orderPlacing ? 'Placing Order...' : 'Checkout'} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}