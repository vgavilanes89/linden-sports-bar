import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 py-12 text-center text-zinc-500">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-black text-white uppercase mb-4">
          Linden <span className="text-amber-500">Sports Bar</span>
        </h2>
        <p className="mb-6">Linden, NJ • Open 7 Days a Week</p>
        <div className="flex justify-center space-x-6 mb-8">
          <button className="hover:text-amber-500 transition-colors">Facebook</button>
          <button className="hover:text-amber-500 transition-colors">Instagram</button>
          <button className="hover:text-amber-500 transition-colors">Twitter</button>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Linden Sports Bar & Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
}