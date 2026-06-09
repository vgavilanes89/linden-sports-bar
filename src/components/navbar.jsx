import React, { useState } from 'react';
import { ShoppingCart, User, Menu as MenuIcon, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  activeTab,
  setActiveTab,
  cart,
  setIsCartOpen,
  setIsAuthModalOpen,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b border-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => setActiveTab('home')}
          >
            <span className="font-bold text-2xl tracking-tighter uppercase">
              Linden <span className="text-amber-500">Sports Bar</span>
            </span>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`hover:text-amber-500 transition-colors ${activeTab === 'home' ? 'text-amber-500' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`hover:text-amber-500 transition-colors ${activeTab === 'menu' ? 'text-amber-500' : ''}`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab('specials')}
              className={`hover:text-amber-500 transition-colors ${activeTab === 'specials' ? 'text-amber-500' : ''}`}
            >
              Specials
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`hover:text-amber-500 transition-colors ${activeTab === 'events' ? 'text-amber-500' : ''}`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`hover:text-amber-500 transition-colors ${activeTab === 'reservations' ? 'text-amber-500' : ''}`}
            >
              Reservations
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`hover:text-amber-500 transition-colors flex items-center gap-1 ${activeTab === 'admin' ? 'text-amber-500' : ''}`}
              >
                <Shield className="w-4 h-4" /> Admin
              </button>
            )}

            <div className="flex items-center space-x-4 border-l border-zinc-800 pl-6">
              <button
                onClick={handleAuthClick}
                className="flex items-center hover:text-amber-500 transition-colors"
              >
                <User className="w-5 h-5 mr-1" />
                <span className="text-sm max-w-[120px] truncate">
                  {user ? user.name.split(' ')[0] : 'Login'}
                </span>
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center hover:text-amber-500 transition-colors text-amber-500"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsCartOpen(true)} className="relative text-amber-500">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-amber-500"
            >
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-amber-500/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-4 text-base font-medium hover:text-amber-500 hover:bg-black"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('menu');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-4 text-base font-medium hover:text-amber-500 hover:bg-black"
            >
              Menu
            </button>
            <button
              onClick={() => {
                setActiveTab('specials');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-4 text-base font-medium hover:text-amber-500 hover:bg-black"
            >
              Specials
            </button>
            <button
              onClick={() => {
                setActiveTab('events');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-4 text-base font-medium hover:text-amber-500 hover:bg-black"
            >
              Events
            </button>
            <button
              onClick={() => {
                setActiveTab('reservations');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-4 text-base font-medium hover:text-amber-500 hover:bg-black"
            >
              Reservations
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-4 text-base font-medium hover:text-amber-500 hover:bg-black"
              >
                Admin
              </button>
            )}
            <button
              onClick={() => {
                handleAuthClick();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-4 text-base font-medium text-amber-500 hover:bg-black"
            >
              {user ? `Sign Out (${user.name.split(' ')[0]})` : 'Login / Register'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
