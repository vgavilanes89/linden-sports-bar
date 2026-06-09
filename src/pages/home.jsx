import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, Flame, CheckCircle2, User, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const HERO_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1920&q=80',
    alt: 'Sports bar interior with TVs and seating',
  },
  {
    src: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1920&q=80',
    alt: 'Crispy wings on a platter',
  },
  {
    src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80',
    alt: 'Bar with draft beers on tap',
  },
  {
    src: 'https://images.unsplash.com/photo-1540747913346-19eb32f3be51?auto=format&fit=crop&w=1920&q=80',
    alt: 'Friends watching the game at the bar',
  },
];

const SLIDE_INTERVAL_MS = 5000;

export default function Home({ setActiveTab }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = useCallback((index) => {
    setActiveSlide((index + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToNext = useCallback(() => goToSlide(activeSlide + 1), [activeSlide, goToSlide]);
  const goToPrev = useCallback(() => goToSlide(activeSlide - 1), [activeSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(goToNext, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div>
      <div className="relative bg-black h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? 'opacity-40' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <button
          onClick={goToPrev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-amber-500 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-amber-500 hover:text-black transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">
            Welcome to <br/><span className="text-amber-500">Linden</span> Sports Bar
          </h1>
          <p className="text-lg md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Cold Beer. Great Food. Every Game. Order online now for quick pickup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveTab('menu')}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg px-8 py-4 rounded-full transition-transform hover:scale-105 flex items-center justify-center"
            >
              <Utensils className="mr-2 w-5 h-5" /> View Menu & Order
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className="bg-transparent border-2 border-white hover:border-amber-500 hover:text-amber-500 text-white font-bold text-lg px-8 py-4 rounded-full transition-colors flex items-center justify-center"
            >
              <CalendarDays className="mr-2 w-5 h-5" /> Make a Reservation
            </button>
            <button
              onClick={() => setActiveTab('specials')}
              className="bg-transparent border-2 border-white hover:border-amber-500 hover:text-amber-500 text-white font-bold text-lg px-8 py-4 rounded-full transition-colors flex items-center justify-center"
            >
              <Flame className="mr-2 w-5 h-5" /> Today's Specials
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'w-8 bg-amber-500' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-zinc-950 py-12 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-amber-500" />
            <h4 className="text-white font-bold">Fast Online Ordering</h4>
            <p className="text-zinc-500 text-sm">Skip the line, order ahead.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Flame className="w-10 h-10 text-amber-500" />
            <h4 className="text-white font-bold">Game Day Specials</h4>
            <p className="text-zinc-500 text-sm">Best wings in Linden, NJ.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <User className="w-10 h-10 text-amber-500" />
            <h4 className="text-white font-bold">Easy Login</h4>
            <p className="text-zinc-500 text-sm">Google, Apple, or Yahoo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
