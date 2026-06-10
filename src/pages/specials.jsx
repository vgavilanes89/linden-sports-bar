import React, { useState } from 'react';
import { CalendarDays, Clock, Star, X, ZoomIn } from 'lucide-react';

const SPECIALS = [
  {
    id: 'happy-hour',
    title: 'Happy Hour',
    subtitle: 'Monday–Friday · 4 PM – 6 PM',
    schedule: { day: 'Monday – Friday', time: '4 PM – 6 PM' },
    description:
      'Catch the game on the big screens and unwind with coworkers after work. Beers, shots, house cocktails, martinis, and sangria at unbeatable prices.',
    image: '/specials/happy-hour.png',
    alt: 'Happy Hour flyer — drink specials Monday through Friday 4–6 PM at Linden Sports Bar',
    tags: ['Drink Special', 'Happy Hour', 'Weekdays'],
    deals: [
      {
        item: 'All Beers & House Shots',
        price: '$3',
        note: 'Draft, bottle, foreign & domestic beers',
      },
      {
        item: 'Mezcal Margarita, Malibu Bay Breeze, Whiskey Sour, House Margarita & House Mixed Drink',
        price: '$5',
      },
      { item: 'House Martini', price: '$7' },
      { item: 'Large House White & Red Sangria', price: '$20' },
    ],
  },
  {
    id: 'taco-tuesday',
    title: 'Taco Tuesday',
    subtitle: 'All day · Every Tuesday',
    schedule: { day: 'Every Tuesday', time: 'All Day' },
    description:
      'Street-style tacos, ice-cold draft beer, and house margaritas in a festive bar atmosphere. Load up the table with tacos and keep the drinks flowing all night.',
    image: '/specials/taco-tuesday.png',
    alt: 'Taco Tuesday flyer — $2 tacos, $3 draft beers, and $5 margaritas at Linden Sports Bar',
    tags: ['Food Special', 'Drink Special', 'Weekly'],
    deals: [
      { item: 'Tacos', price: '$2', note: 'Minimum 4 tacos per person' },
      { item: 'Draft Beers', price: '$3' },
      { item: 'Margaritas', price: '$5' },
    ],
  },
  {
    id: 'wednesday-margaritas',
    title: 'Wednesday Margarita Special',
    subtitle: 'After Work Social',
    schedule: { day: 'Every Wednesday', time: 'All Day' },
    description:
      'Unwind after work with $5.99 margaritas all day long. Classic lime, strawberry, and house margaritas — perfect for toasting with coworkers and friends.',
    image: '/specials/wednesday-margaritas.png',
    alt: 'Wednesday All Day $5.99 Margaritas flyer — After Work Social at Linden Sports Bar',
    tags: ['Drink Special', 'After Work', 'Weekly'],
    deals: [{ item: 'Margaritas', price: '$5.99', note: 'All day · Every Wednesday' }],
  },
  {
    id: 'ladies-night',
    title: 'Ladies Night',
    subtitle: 'Grab your girls & join us!',
    schedule: { day: 'Every Thursday', time: 'After 6 PM' },
    description:
      'Signature cocktails, sangria pitchers, and shareable appetizers in a lively lounge setting. The perfect night out with your crew.',
    image: '/specials/ladies-night.png',
    alt: 'Ladies Night flyer — $10 signature cocktails and $19.99 sangria pitchers every Thursday after 6 PM',
    tags: ['Drink Special', 'Ladies Night', 'Weekly'],
    deals: [
      { item: 'Signature Cocktails', price: '$10' },
      { item: 'Sangria Pitchers', price: '$19.99' },
    ],
  },
];

function FlyerModal({ special, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-amber-500 hover:text-black transition-colors"
          aria-label="Close flyer"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={special.image}
          alt={special.alt}
          className="w-full h-auto rounded-2xl border border-amber-500/30 shadow-2xl"
        />
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-white">{special.title}</h3>
          <p className="text-amber-500 mt-1">{special.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function SpecialCard({ special, onViewFlyer }) {
  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors group">
      <button
        type="button"
        onClick={() => onViewFlyer(special)}
        className="relative block w-full overflow-hidden cursor-zoom-in"
        aria-label={`View full flyer for ${special.title}`}
      >
        <img
          src={special.image}
          alt={special.alt}
          className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-black font-bold px-4 py-2 rounded-full flex items-center gap-2">
            <ZoomIn className="w-4 h-4" /> View Flyer
          </span>
        </div>
      </button>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {special.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold uppercase tracking-wide bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-2xl font-bold text-white">{special.title}</h3>
        <p className="text-amber-500 font-medium mt-1">{special.subtitle}</p>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-amber-500" />
            {special.schedule.day}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            {special.schedule.time}
          </span>
        </div>

        <p className="text-zinc-400 mt-4 leading-relaxed">{special.description}</p>

        <ul className="mt-5 space-y-2 border-t border-zinc-800 pt-5">
          {special.deals.map((deal) => (
            <li key={deal.item} className="flex justify-between items-start gap-4">
              <div>
                <span className="text-white font-medium">{deal.item}</span>
                {deal.note && (
                  <p className="text-zinc-500 text-sm mt-0.5">{deal.note}</p>
                )}
              </div>
              <span className="text-xl font-bold text-amber-500 shrink-0">{deal.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Specials() {
  const [selectedSpecial, setSelectedSpecial] = useState(null);

  return (
    <div className="bg-zinc-950 min-h-screen py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-amber-500 uppercase flex items-center justify-center gap-3">
            <Star className="w-10 h-10" fill="currentColor" /> Weekly Specials
          </h2>
          <p className="text-zinc-400 mt-4 text-lg max-w-2xl mx-auto">
            Happy hour, Taco Tuesday, midweek margaritas, and Ladies Night — recurring deals every
            week at Linden Sports Bar & Restaurant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SPECIALS.map((special) => (
            <SpecialCard
              key={special.id}
              special={special}
              onViewFlyer={setSelectedSpecial}
            />
          ))}
        </div>
      </div>

      {selectedSpecial && (
        <FlyerModal special={selectedSpecial} onClose={() => setSelectedSpecial(null)} />
      )}
    </div>
  );
}
