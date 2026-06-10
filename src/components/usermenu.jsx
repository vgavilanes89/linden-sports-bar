import React, { useEffect, useRef, useState } from 'react';
import { User, ClipboardList, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu({ setActiveTab, setIsAuthModalOpen }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => setIsAuthModalOpen(true)}
        className="flex items-center hover:text-amber-500 transition-colors"
      >
        <User className="w-5 h-5 mr-1" />
        <span className="text-sm">Login</span>
      </button>
    );
  }

  const firstName = user.name.split(' ')[0];

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 hover:text-amber-500 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <User className="w-5 h-5" />
        <span className="text-sm max-w-[120px] truncate">{firstName}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-2 z-50">
          <div className="w-52 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-white font-semibold text-sm truncate">{user.name}</p>
              {user.email && (
                <p className="text-zinc-500 text-xs truncate mt-0.5">{user.email}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('orders');
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-black hover:text-amber-500 transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              My Orders
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                setOpen(false);
                setActiveTab('home');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-black hover:text-red-400 transition-colors border-t border-zinc-800"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
