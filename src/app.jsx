import React, { useState } from 'react';

import Navbar from './components/navbar';
import Footer from './components/footer';
import Cart from './components/cart';
import AuthModal from './components/authmodal';
import Account from './pages/account';

import Home from './pages/home';
import Menu from './pages/menu';
import Specials from './pages/specials';
import Reservations from './pages/reservations';
import Events from './pages/events';
import Admin from './pages/admin';
import Orders from './pages/orders';
import { placeOrder } from './lib/orders';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlacing, setOrderPlacing] = useState(false);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (user) => {
    const subtotal = cartTotal;
    const tax = subtotal * 0.0662;
    const total = subtotal + tax;

    setOrderPlacing(true);
    try {
      await placeOrder({
        items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        subtotal,
        tax,
        total,
      });
      setCart([]);
      setIsCartOpen(false);
      setActiveTab('orders');
    } catch (err) {
      alert(err.message || 'Could not place order. Please try again.');
    } finally {
      setOrderPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-amber-500 selection:text-black">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
      />

      <main>
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'specials' && <Specials />}
        {activeTab === 'menu' && <Menu addToCart={addToCart} />}
        {activeTab === 'reservations' && <Reservations />}
        {activeTab === 'events' && <Events setActiveTab={setActiveTab} />}
        {activeTab === 'orders' && (
          <Orders setActiveTab={setActiveTab} setIsAuthModalOpen={setIsAuthModalOpen} />
        )}
        {activeTab === 'account' && (
          <Account setActiveTab={setActiveTab} setIsAuthModalOpen={setIsAuthModalOpen} />
        )}
        {activeTab === 'admin' && (
          <Admin setActiveTab={setActiveTab} setIsAuthModalOpen={setIsAuthModalOpen} />
        )}
      </main>

      <Footer />

      <Cart
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        cartTotal={cartTotal}
        setIsAuthModalOpen={setIsAuthModalOpen}
        setActiveTab={setActiveTab}
        onPlaceOrder={handlePlaceOrder}
        orderPlacing={orderPlacing}
      />

      <AuthModal
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        onAuthenticated={(loggedInUser) => {
          if (!loggedInUser.phoneVerified) {
            setActiveTab('account');
          }
        }}
      />
    </div>
  );
}
