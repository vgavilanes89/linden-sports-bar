import React from 'react';
import { Star } from 'lucide-react';

// Specials Data
const SPECIALS = [
  { id: 's1', name: 'Golden Honey BBQ Wings', description: 'Our signature crispy wings tossed in a sweet and tangy gold-standard BBQ sauce.', price: 14.99, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80' },
  { id: 's2', name: 'The Linden MVP Burger', description: 'Double smash patties, cheddar, crispy onion rings, and house gold sauce.', price: 16.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { id: 's3', name: 'Game Day Nacho Mountain', description: 'Loaded with pulled pork, jalapeños, black beans, and our liquid gold cheese sauce.', price: 15.99, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80' },
];

export default function Specials({ addToCart }) {
  return (
    <div className="bg-zinc-950 min-h-screen py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-amber-500 uppercase flex items-center justify-center gap-3">
            <Star className="w-10 h-10" fill="currentColor" /> Signature Specials
          </h2>
          <p className="text-zinc-400 mt-4 text-lg">Available for a limited time. Don't miss out!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SPECIALS.map(special => (
            <div key={special.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-amber-500 transition-colors">
              <div className="h-64 overflow-hidden">
                <img 
                  src={special.image} 
                  alt={special.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{special.name}</h3>
                  <span className="text-xl font-bold text-amber-500">${special.price.toFixed(2)}</span>
                </div>
                <p className="text-zinc-400 mb-6 min-h-[48px]">{special.description}</p>
                <button 
                  onClick={() => addToCart(special)}
                  className="w-full bg-white hover:bg-amber-500 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center"
                >
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}