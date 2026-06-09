import React, { useState } from 'react';
import { ShoppingCart, ImageIcon } from 'lucide-react';
import { MENU_SECTIONS, MENU_CATEGORIES_BY_SECTION, MENU_ITEMS } from '../data/menu';

function MenuItemImage({ item }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 rounded-lg object-cover shrink-0 hidden sm:block"
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="w-20 h-20 rounded-lg shrink-0 hidden sm:flex flex-col items-center justify-center gap-1 bg-zinc-800 border border-zinc-700 text-center px-1"
      aria-label={`${item.name} photo coming soon`}
    >
      <ImageIcon className="w-5 h-5 text-zinc-600" />
      <span className="text-[10px] font-semibold uppercase leading-tight text-zinc-500">
        Photo Coming Soon
      </span>
    </div>
  );
}

function MenuItemCard({ item, addToCart }) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl flex gap-4 items-start border border-transparent hover:border-zinc-700 transition-colors">
      <MenuItemImage item={item} />
      <div className="flex-1 min-w-0">
        <h4 className="text-lg font-bold text-white">{item.name}</h4>
        {item.description && (
          <p className="text-zinc-400 text-sm mt-1 line-clamp-3">{item.description}</p>
        )}
        <span className="text-amber-500 font-bold block mt-2">
          ${item.price.toFixed(2)}
        </span>
      </div>
      <button
        onClick={() => addToCart(item)}
        className="bg-zinc-800 hover:bg-amber-500 hover:text-black text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0"
        aria-label={`Add ${item.name} to cart`}
      >
        <ShoppingCart className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function Menu({ addToCart }) {
  const [activeSection, setActiveSection] = useState(MENU_SECTIONS[0]);

  const subcategories = MENU_CATEGORIES_BY_SECTION[activeSection] ?? [];
  const sectionItems = MENU_ITEMS.filter((item) => item.section === activeSection);

  return (
    <div className="bg-black min-h-screen py-16 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white uppercase">
            Our <span className="text-amber-500">Menu</span>
          </h2>
          <p className="text-zinc-400 mt-4">Order online for quick and easy pickup.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          {MENU_SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`flex-1 py-4 px-6 rounded-xl text-base font-bold uppercase tracking-wide transition-colors ${
                activeSection === section
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <div className="space-y-16">
          {subcategories.map((category) => {
            const items = sectionItems.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-2xl font-bold border-b-2 border-amber-500 pb-2 mb-6 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <MenuItemCard key={item.id} item={item} addToCart={addToCart} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
