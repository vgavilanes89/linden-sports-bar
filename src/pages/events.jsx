import React, { useState } from 'react';
import { CalendarDays, MapPin, X, ZoomIn } from 'lucide-react';

const EVENTS = [
  {
    id: 'todays-specials',
    title: "Today's Specials",
    subtitle: 'All FIFA games showing here!',
    date: 'Daily',
    time: 'While supplies last',
    description:
      'Beer bucket and pizza for $24.99, aguardiente and Colombian picada for $59.99, plus $15 domestic buckets, $20 imported buckets, and $3 house shots. Catch every FIFA match on the big screens.',
    image: '/specials/todays-specials.png',
    alt: "Today's Specials flyer — beer bucket and pizza, aguardiente and picada, bucket and shot deals; all FIFA games at Linden Sports Bar",
    tags: ['Live Sports', 'FIFA', 'Food & Drink Specials'],
  },
  {
    id: 'mondays-basketball',
    title: 'Mondays Are for Basketball',
    subtitle: 'NBA Finals • Game 3 — Spurs vs Knicks',
    date: 'Monday, June 8',
    time: '8:30 PM',
    description:
      'Watch the game with us on the big screens. NYK leads the series 2-0. Good food, cold drinks, and good vibes all night.',
    image: '/events/mondays-basketball.png',
    alt: 'Mondays Are for Basketball flyer — Spurs vs Knicks NBA Finals Game 3',
    tags: ['Live Sports', 'NBA Finals', 'Big Screens'],
  },
  {
    id: 'game-night-specials',
    title: 'Game Night Specials',
    subtitle: 'Knicks vs Spurs — Tonight at 8:30 PM',
    date: 'Game Night',
    time: '8:30 PM NJ/NY',
    description:
      'Wings, empanadas, calamari, pizza, and drink specials all night. Draft beer $3, shots $3, house mix drinks $5.',
    image: '/events/game-night-specials.png',
    alt: 'Game Night Specials flyer — food and drink deals for Knicks vs Spurs',
    tags: ['Food Specials', 'Drink Specials', 'Live Sports'],
  },
];

function FlyerModal({ event, onClose }) {
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
          src={event.image}
          alt={event.alt}
          className="w-full h-auto rounded-2xl border border-amber-500/30 shadow-2xl"
        />
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <p className="text-amber-500 mt-1">{event.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, onViewFlyer }) {
  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors group">
      <button
        type="button"
        onClick={() => onViewFlyer(event)}
        className="relative block w-full overflow-hidden cursor-zoom-in"
        aria-label={`View full flyer for ${event.title}`}
      >
        <img
          src={event.image}
          alt={event.alt}
          className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-black font-bold px-4 py-2 rounded-full flex items-center gap-2">
            <ZoomIn className="w-4 h-4" /> View Flyer
          </span>
        </div>
      </button>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold uppercase tracking-wide bg-black text-amber-500 px-3 py-1 rounded-full border border-amber-500/30"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-2xl font-black uppercase text-white">{event.title}</h3>
        <p className="text-amber-500 font-semibold mt-1">{event.subtitle}</p>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-amber-500" />
            {event.date} • {event.time}
          </span>
        </div>

        <p className="text-zinc-400 mt-4 text-sm leading-relaxed">{event.description}</p>

        <button
          type="button"
          onClick={() => onViewFlyer(event)}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors"
        >
          View Full Flyer
        </button>
      </div>
    </article>
  );
}

export default function Events({ setActiveTab }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="bg-black min-h-screen py-16 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black uppercase">
            Upcoming <span className="text-amber-500">Events</span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Game nights, watch parties, and specials at Linden Sports Bar. Good food, cold drinks,
            good vibes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {EVENTS.map((event) => (
            <EventCard key={event.id} event={event} onViewFlyer={setSelectedEvent} />
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 text-zinc-300">
            <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-semibold text-white">700 E Elizabeth Ave, Linden, NJ</p>
              <p className="text-sm text-zinc-500">Big screens • Great music • Good times</p>
            </div>
          </div>
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('reservations')}
              className="shrink-0 bg-white hover:bg-amber-500 text-black font-bold px-6 py-3 rounded-full transition-colors"
            >
              Reserve a Table
            </button>
          )}
        </div>
      </div>

      {selectedEvent && (
        <FlyerModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
