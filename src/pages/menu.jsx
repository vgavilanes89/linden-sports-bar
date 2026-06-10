import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, ImageIcon } from 'lucide-react';
import { MENU_SECTIONS, MENU_CATEGORIES_BY_SECTION, MENU_ITEMS } from '../data/menu';

const FOOD_SECTION = 'Food';

function formatCategoryLabel(category) {
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

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
  const [activeCategory, setActiveCategory] = useState(null);

  const subcategories = MENU_CATEGORIES_BY_SECTION[activeSection] ?? [];
  const sectionItems = MENU_ITEMS.filter((item) => item.section === activeSection);

  const foodCategoriesWithItems = useMemo(() => {
    if (activeSection !== FOOD_SECTION) return [];
    return subcategories.filter((category) =>
      sectionItems.some((item) => item.category === category)
    );
  }, [activeSection, subcategories, sectionItems]);

  useEffect(() => {
    if (activeSection !== FOOD_SECTION) {
      setActiveCategory(null);
      return;
    }

    setActiveCategory((current) => {
      if (current && foodCategoriesWithItems.includes(current)) return current;
      return foodCategoriesWithItems[0] ?? null;
    });
  }, [activeSection, foodCategoriesWithItems]);

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

        {activeSection === FOOD_SECTION && foodCategoriesWithItems.length > 0 && (
          <nav
            className="mb-10 flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3"
            aria-label="Food categories"
          >
            {foodCategoriesWithItems.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors hover:underline ${
                  activeCategory === category
                    ? 'text-amber-500 underline'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {formatCategoryLabel(category)}
              </button>
            ))}
          </nav>
        )}

        {activeSection === FOOD_SECTION ? (
          activeCategory && (
            <div>
              <h3 className="mb-6 border-b-2 border-amber-500 pb-2 text-2xl font-bold uppercase tracking-wider">
                {formatCategoryLabel(activeCategory)}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {sectionItems
                  .filter((item) => item.category === activeCategory)
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} addToCart={addToCart} />
                  ))}
              </div>
            </div>
          )
        ) : (
          <div className="space-y-16">
            {subcategories.map((category) => {
              const items = sectionItems.filter((item) => item.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="mb-6 border-b-2 border-amber-500 pb-2 text-2xl font-bold uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {items.map((item) => (
                      <MenuItemCard key={item.id} item={item} addToCart={addToCart} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
