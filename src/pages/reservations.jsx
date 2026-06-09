import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Users,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Wine,
} from 'lucide-react';

function buildTimeSlots() {
  const slots = [];
  for (let hour = 11; hour <= 22; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 22 && minute === 30) break;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const minuteStr = minute.toString().padStart(2, '0');
      slots.push(`${displayHour}:${minuteStr} ${period}`);
    }
  }
  return slots;
}

const TIME_SLOTS = buildTimeSlots();
const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateValue(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDisplayDate(value) {
  const date = parseDateValue(value);
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function MiniCalendar({ value, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = parseDateValue(value);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDayOfMonth.getDay();

  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));

  const goToMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="bg-black border border-zinc-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          className="p-2 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-900 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-white">{monthLabel}</span>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          className="p-2 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-900 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-bold text-zinc-500 py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const isPast = date < today;
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <button
              key={toDateValue(date)}
              type="button"
              disabled={isPast}
              onClick={() => onChange(toDateValue(date))}
              className={`aspect-square rounded-lg text-sm font-semibold transition-colors ${
                isSelected
                  ? 'bg-amber-500 text-black'
                  : isPast
                    ? 'text-zinc-700 cursor-not-allowed'
                    : isToday
                      ? 'border border-amber-500/50 text-amber-500 hover:bg-zinc-900'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {value ? (
        <p className="text-sm text-amber-500 font-medium mt-4 text-center">{formatDisplayDate(value)}</p>
      ) : (
        <p className="text-sm text-zinc-500 mt-4 text-center">Select a date</p>
      )}
    </div>
  );
}

const PARTY_SIZES = Array.from({ length: 12 }, (_, i) => i + 1);
const TAX_RATE = 0.0662;

const BOTTLE_PREORDER_OPTIONS = [
  { id: 'aguardiente-small', name: 'Aguardiente (Small)', price: 50 },
  { id: 'aguardiente-bottle', name: 'Aguardiente (Bottle)', price: 80 },
  { id: 'amarillo', name: 'Amarillo', price: 120 },
  { id: 'buchanans-small', name: "Buchanan's (Small)", price: 70 },
  { id: 'buchanans-bottle', name: "Buchanan's (Bottle)", price: 160 },
  { id: 'hennessy-small', name: 'Hennessy (Small)', price: 70 },
  { id: 'hennessy-bottle', name: 'Hennessy (Bottle)', price: 160 },
  { id: 'don-julio-reposado', name: 'Don Julio Reposado', price: 180 },
  { id: 'don-julio-small', name: 'Don Julio (Small)', price: 50 },
  { id: 'don-julio-bottle', name: 'Don Julio (Bottle)', price: 170 },
  { id: 'clase-azul', name: 'Clase Azul', price: 550 },
  { id: 'moet-rose', name: 'Moët & Chandon Rosé Impérial', price: 200 },
  { id: 'patron-small', name: 'Patrón (Small)', price: 80 },
  { id: 'patron-bottle', name: 'Patrón (Bottle)', price: 160 },
];

function getSelectedBottle(id) {
  return BOTTLE_PREORDER_OPTIONS.find((bottle) => bottle.id === id);
}

function createBottleLine() {
  return { id: crypto.randomUUID(), bottleId: '', quantity: 1 };
}

function getActiveBottleLines(lines) {
  return lines
    .filter((line) => line.bottleId)
    .map((line) => {
      const bottle = getSelectedBottle(line.bottleId);
      return bottle ? { ...line, bottle } : null;
    })
    .filter(Boolean);
}

function getBottlePreorderTotal(lines) {
  return getActiveBottleLines(lines).reduce(
    (sum, line) => sum + line.bottle.price * line.quantity,
    0
  );
}

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  partySize: '2',
  bottlePreorders: [createBottleLine()],
  notes: '',
};

const INITIAL_PAYMENT = {
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

function FormField({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-zinc-300 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClassName =
  'w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors';

function BottlePreorderSection({ lines, onChange }) {
  const activeLines = getActiveBottleLines(lines);
  const total = getBottlePreorderTotal(lines);

  const updateLine = (lineId, updates) => {
    onChange(lines.map((line) => (line.id === lineId ? { ...line, ...updates } : line)));
  };

  const addLine = () => {
    onChange([...lines, createBottleLine()]);
  };

  const removeLine = (lineId) => {
    if (lines.length === 1) {
      onChange([createBottleLine()]);
      return;
    }
    onChange(lines.filter((line) => line.id !== lineId));
  };

  const adjustQuantity = (lineId, delta) => {
    const line = lines.find((item) => item.id === lineId);
    if (!line) return;
    updateLine(lineId, { quantity: Math.max(1, line.quantity + delta) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-zinc-300">
          Pre-Order Bottles (Optional)
        </label>
        {activeLines.length > 0 && (
          <span className="text-sm font-bold text-amber-500">Est. ${total.toFixed(2)}</span>
        )}
      </div>

      <div className="space-y-4">
        {lines.map((line, index) => (
          <div key={line.id} className="bg-black border border-zinc-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                Bottle {index + 1}
              </span>
              {lines.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                  aria-label={`Remove bottle ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={line.bottleId}
              onChange={(event) => updateLine(line.id, { bottleId: event.target.value })}
              className={inputClassName}
              aria-label={`Select bottle ${index + 1}`}
            >
              <option value="">Select a bottle</option>
              {BOTTLE_PREORDER_OPTIONS.map((bottle) => (
                <option key={bottle.id} value={bottle.id}>
                  {bottle.name} — ${bottle.price.toFixed(2)}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Quantity</span>
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1">
                <button
                  type="button"
                  onClick={() => adjustQuantity(line.id, -1)}
                  className="text-zinc-400 hover:text-amber-500 px-2 py-1 font-bold"
                  aria-label={`Decrease quantity for bottle ${index + 1}`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-medium w-6 text-center">{line.quantity}</span>
                <button
                  type="button"
                  onClick={() => adjustQuantity(line.id, 1)}
                  className="text-zinc-400 hover:text-amber-500 px-2 py-1 font-bold"
                  aria-label={`Increase quantity for bottle ${index + 1}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {line.bottleId && (
              <p className="text-sm text-zinc-500">
                Line total:{' '}
                <span className="text-amber-500 font-semibold">
                  ${(getSelectedBottle(line.bottleId).price * line.quantity).toFixed(2)}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLine}
        className="mt-4 w-full border border-dashed border-zinc-700 hover:border-amber-500 text-zinc-400 hover:text-amber-500 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Another Bottle
      </button>
    </div>
  );
}

function ReservationSummary({ form, activeBottleLines, subtotal, tax, total }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold uppercase text-white mb-3">Reservation</h3>
        <div className="text-sm text-zinc-400 space-y-1">
          <p className="text-white font-semibold">{form.name}</p>
          <p>{form.email}</p>
          <p>{form.phone}</p>
          <p className="pt-2">
            {formatDisplayDate(form.date) || form.date} at {form.time} · {form.partySize}{' '}
            {form.partySize === '1' ? 'guest' : 'guests'}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold uppercase text-white mb-3 flex items-center gap-2">
          <Wine className="w-5 h-5 text-amber-500" /> Bottle Pre-Order
        </h3>
        <ul className="space-y-3">
          {activeBottleLines.map((line) => (
            <li
              key={line.id}
              className="flex justify-between items-start text-sm bg-black border border-zinc-800 rounded-xl p-4"
            >
              <div>
                <p className="font-semibold text-white">{line.bottle.name}</p>
                <p className="text-zinc-500">Qty: {line.quantity}</p>
              </div>
              <span className="text-amber-500 font-bold">
                ${(line.bottle.price * line.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Tax (Estimated)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white text-lg font-bold pt-2">
          <span>Total Due Now</span>
          <span className="text-amber-500">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function ReservationCheckout({ form, payment, setPayment, onBack, onPay, isProcessing }) {
  const activeBottleLines = getActiveBottleLines(form.bottlePreorders);
  const subtotal = getBottlePreorderTotal(form.bottlePreorders);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const updatePayment = (field) => (event) => {
    setPayment((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <div className="bg-black min-h-screen py-16 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" /> Back to reservation
        </button>

        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase">
            Bottle Pre-Order <span className="text-amber-500">Checkout</span>
          </h2>
          <p className="text-zinc-400 mt-4">
            Your table request is saved. Complete payment for your bottle pre-order below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onPay();
            }}
            className="space-y-6"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold uppercase flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" /> Payment Details
              </h3>

              <FormField label="Name on Card" id="cardName">
                <input
                  id="cardName"
                  type="text"
                  required
                  value={payment.cardName}
                  onChange={updatePayment('cardName')}
                  placeholder="John Smith"
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Card Number" id="cardNumber">
                <input
                  id="cardNumber"
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={payment.cardNumber}
                  onChange={updatePayment('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  className={inputClassName}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Expiry" id="expiry">
                  <input
                    id="expiry"
                    type="text"
                    required
                    autoComplete="cc-exp"
                    value={payment.expiry}
                    onChange={updatePayment('expiry')}
                    placeholder="MM/YY"
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="CVC" id="cvc">
                  <input
                    id="cvc"
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={payment.cvc}
                    onChange={updatePayment('cvc')}
                    placeholder="123"
                    className={inputClassName}
                  />
                </FormField>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-lg py-4 rounded-xl transition-colors"
            >
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>

            <p className="text-xs text-zinc-500 text-center">
              Payment is for bottle pre-order only. Your table will be confirmed separately by our
              team.
            </p>
          </form>

          <ReservationSummary
            form={form}
            activeBottleLines={activeBottleLines}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}

function ReservationSuccess({ form, activeBottleLines, paidTotal, onReset }) {
  return (
    <div className="bg-black min-h-screen py-16 text-white">
      <div className="max-w-xl mx-auto px-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-amber-500 mx-auto mb-6" />
        <h2 className="text-3xl font-black uppercase mb-4">
          Reservation <span className="text-amber-500">Confirmed</span>
        </h2>
        <p className="text-zinc-400 mb-2">
          Thanks, {form.name.split(' ')[0] || 'guest'}! Your table for {form.partySize}{' '}
          {form.partySize === '1' ? 'guest' : 'guests'} on {formatDisplayDate(form.date) || form.date} at{' '}
          {form.time} has been requested.
        </p>

        {activeBottleLines.length > 0 && (
          <div className="text-zinc-400 mb-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left">
            <p className="font-semibold text-white mb-3">Bottle pre-order paid</p>
            <ul className="space-y-2">
              {activeBottleLines.map((line) => (
                <li key={line.id} className="flex justify-between text-sm">
                  <span>
                    {line.quantity}x {line.bottle.name}
                  </span>
                  <span className="text-amber-500 font-semibold">
                    ${(line.bottle.price * line.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-white font-bold mt-4 pt-4 border-t border-zinc-800">
              Total paid: ${paidTotal.toFixed(2)}
            </p>
          </div>
        )}

        <p className="text-zinc-500 text-sm mb-8">
          Our team will confirm your table shortly. For same-day changes, call us directly.
        </p>
        <button
          onClick={onReset}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-full transition-colors"
        >
          Make Another Reservation
        </button>
      </div>
    </div>
  );
}

export default function Reservations() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [payment, setPayment] = useState(INITIAL_PAYMENT);
  const [step, setStep] = useState('form');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidTotal, setPaidTotal] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.date) return;

    const hasBottles = getActiveBottleLines(form.bottlePreorders).length > 0;
    setStep(hasBottles ? 'checkout' : 'success');
  };

  const handlePay = () => {
    setIsProcessing(true);
    const subtotal = getBottlePreorderTotal(form.bottlePreorders);
    const total = subtotal + subtotal * TAX_RATE;

    setTimeout(() => {
      setPaidTotal(total);
      setIsProcessing(false);
      setStep('success');
    }, 1200);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setPayment(INITIAL_PAYMENT);
    setPaidTotal(0);
    setStep('form');
  };

  const activeBottleLines = getActiveBottleLines(form.bottlePreorders);

  if (step === 'checkout') {
    return (
      <ReservationCheckout
        form={form}
        payment={payment}
        setPayment={setPayment}
        onBack={() => setStep('form')}
        onPay={handlePay}
        isProcessing={isProcessing}
      />
    );
  }

  if (step === 'success') {
    return (
      <ReservationSuccess
        form={form}
        activeBottleLines={activeBottleLines}
        paidTotal={paidTotal}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="bg-black min-h-screen py-16 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black uppercase">
            Make a <span className="text-amber-500">Reservation</span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Book your table for game day, date night, or a group dinner. Bottle pre-orders are paid
            at checkout after you submit your request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <FormField label="Full Name" id="name">
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={updateField('name')}
                  placeholder="John Smith"
                  className={inputClassName}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField label="Email" id="email">
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={updateField('email')}
                    placeholder="you@email.com"
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="Phone" id="phone">
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={updateField('phone')}
                    placeholder="(908) 555-0123"
                    className={inputClassName}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField label="Date" id="date">
                  <MiniCalendar
                    value={form.date}
                    onChange={(date) => setForm((prev) => ({ ...prev, date }))}
                  />
                </FormField>

                <div className="space-y-6">
                  <FormField label="Time" id="time">
                    <select
                      id="time"
                      required
                      value={form.time}
                      onChange={updateField('time')}
                      className={inputClassName}
                    >
                      <option value="" disabled>
                        Select a time
                      </option>
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-zinc-500 mt-2">Available 11:00 AM – 10:00 PM</p>
                  </FormField>

                  <FormField label="Party Size" id="partySize">
                    <select
                      id="partySize"
                      required
                      value={form.partySize}
                      onChange={updateField('partySize')}
                      className={inputClassName}
                    >
                      {PARTY_SIZES.map((size) => (
                        <option key={size} value={size}>
                          {size} {size === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                      <option value="13+">13+ Guests</option>
                    </select>
                  </FormField>
                </div>
              </div>

              <BottlePreorderSection
                lines={form.bottlePreorders}
                onChange={(bottlePreorders) => setForm((prev) => ({ ...prev, bottlePreorders }))}
              />

              <FormField label="Special Requests (Optional)" id="notes">
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={updateField('notes')}
                  placeholder="High chair, birthday celebration, seating preference..."
                  className={`${inputClassName} resize-none`}
                />
              </FormField>
            </div>

            <button
              type="submit"
              disabled={!form.date || !form.time}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-lg py-4 rounded-xl transition-colors"
            >
              {getActiveBottleLines(form.bottlePreorders).length > 0
                ? 'Continue to Checkout'
                : 'Request Reservation'}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold uppercase mb-6 text-amber-500">Visit Us</h3>
              <div className="space-y-5 text-zinc-300">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Linden Sports Bar & Restaurant</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      700 E Elizabeth Ave
                      <br />
                      Linden, NJ 07036
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                  <a href="tel:+19085836015" className="hover:text-amber-500 transition-colors">
                    (908) 583-6015
                  </a>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Open 7 Days a Week</p>
                    <p className="text-sm text-zinc-400 mt-1">Kitchen & bar service daily</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CalendarDays className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Large Groups</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      For parties of 13 or more, please call us to arrange your booking.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Users className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Walk-ins Welcome</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      Reservations are recommended on busy game nights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
