import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "classic", name: "Classic Haircut", duration: "45 min", price: "$35", desc: "Scissor or clipper cut, styled to finish." },
  { id: "fade", name: "Fade & Taper", duration: "50 min", price: "$40", desc: "Skin to mid fade, blended to perfection." },
  { id: "beard", name: "Beard Trim & Shape", duration: "30 min", price: "$25", desc: "Line-up, shaping, and hot-towel finish." },
  { id: "combo", name: "Haircut + Beard Combo", duration: "75 min", price: "$60", desc: "Full cut and beard service together." },
  { id: "shave", name: "Head Shave", duration: "40 min", price: "$35", desc: "Hot towel prep, straight razor finish." },
  { id: "colour", name: "Colour / Highlights", duration: "90 min", price: "$80+", desc: "Single process or foil highlights." },
  { id: "kids", name: "Kids Cut", duration: "30 min", price: "$22", desc: "For clients 12 and under." },
];

const BARBERS = {
  Toronto: [
    { id: "marcus", name: "Marcus", specialty: "Fades & Tapers", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&facepad=3&faces=1" },
    { id: "jordan", name: "Jordan", specialty: "Classic Cuts", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&facepad=3&faces=1" },
    { id: "dev",    name: "Dev",    specialty: "Beard & Shave", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop&facepad=3&faces=1" },
  ],
  Montreal: [
    { id: "antoine", name: "Antoine", specialty: "Texture & Colour", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80&auto=format&fit=crop&facepad=3&faces=1" },
    { id: "karim",   name: "Karim",   specialty: "Fades & Skin", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80&auto=format&fit=crop&facepad=3&faces=1" },
    { id: "luca",    name: "Luca",    specialty: "Classic & Beard", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop&facepad=3&faces=1" },
  ],
};

const TIME_SLOTS = [
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM","7:00 PM",
];

const STEPS = ["Service", "Barber", "Date & Time", "Your Info"];

// ─── Calendar helper ──────────────────────────────────────────────────────────

function Calendar({ value, onChange }) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const [cursor, setCursor] = useState(() => {
    const d = value ? new Date(value + "T00:00:00") : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const { year, month } = cursor;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

  const prev = () => setCursor(c => {
    const d = new Date(c.year, c.month - 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const next = () => setCursor(c => {
    const d = new Date(c.year, c.month + 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="text-shop-muted hover:text-shop-gold transition-colors px-2 py-1">←</button>
        <span className="text-shop-text text-sm font-medium">{monthName} {year}</span>
        <button onClick={next} className="text-shop-muted hover:text-shop-gold transition-colors px-2 py-1">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="text-center text-[10px] tracking-widest text-shop-muted uppercase py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(year, month, day);
          date.setHours(0,0,0,0);
          const isPast = date < today;
          const isSun = date.getDay() === 0;
          const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isSelected = value === dateStr;

          return (
            <button
              key={i}
              disabled={isPast || isSun}
              onClick={() => onChange(dateStr)}
              className={`
                aspect-square flex items-center justify-center text-sm transition-all duration-150
                ${isPast || isSun ? "text-shop-border cursor-not-allowed" : "hover:bg-shop-elevated hover:text-shop-gold cursor-pointer"}
                ${isSelected ? "bg-shop-gold text-shop-bg font-semibold" : "text-shop-text"}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepService({ booking, set }) {
  return (
    <div>
      <h2 className="font-playfair text-3xl md:text-4xl font-bold text-shop-text mb-2">Choose your service</h2>
      <p className="text-shop-muted text-sm mb-8">Select one service to continue.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SERVICES.map(s => (
          <button
            key={s.id}
            onClick={() => set("service", s)}
            className={`text-left p-5 border transition-all duration-200 group ${
              booking.service?.id === s.id
                ? "border-shop-gold bg-shop-elevated"
                : "border-shop-border bg-shop-surface hover:border-shop-muted"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`font-medium text-sm ${booking.service?.id === s.id ? "text-shop-gold" : "text-shop-text"}`}>
                {s.name}
              </span>
              <span className="text-shop-gold font-playfair font-bold text-sm ml-2 shrink-0">{s.price}</span>
            </div>
            <p className="text-shop-muted text-xs leading-relaxed mb-3">{s.desc}</p>
            <span className="text-[10px] tracking-widest uppercase text-shop-muted">{s.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepBarber({ booking, set }) {
  const loc = booking.location || "Toronto";
  const barbers = BARBERS[loc];

  return (
    <div>
      <h2 className="font-playfair text-3xl md:text-4xl font-bold text-shop-text mb-2">Pick your barber</h2>
      <p className="text-shop-muted text-sm mb-6">Choose a location, then select your barber.</p>

      {/* Location toggle */}
      <div className="flex gap-0 mb-8 border border-shop-border w-fit">
        {["Toronto","Montreal"].map(city => (
          <button
            key={city}
            onClick={() => { set("location", city); set("barber", null); }}
            className={`px-6 py-2.5 text-xs tracking-widest uppercase transition-all duration-200 ${
              loc === city ? "bg-shop-gold text-shop-bg font-semibold" : "text-shop-muted hover:text-shop-text"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Barber cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {barbers.map(b => (
          <button
            key={b.id}
            onClick={() => set("barber", b)}
            className={`text-left border transition-all duration-200 overflow-hidden group ${
              booking.barber?.id === b.id ? "border-shop-gold" : "border-shop-border hover:border-shop-muted"
            }`}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={b.photo} alt={b.name}
                className={`w-full h-full object-cover object-top transition-all duration-500 ${
                  booking.barber?.id === b.id ? "grayscale-0" : "grayscale group-hover:grayscale-0"
                }`}
              />
            </div>
            <div className={`p-4 ${booking.barber?.id === b.id ? "bg-shop-elevated" : "bg-shop-surface"}`}>
              <p className={`font-medium text-sm ${booking.barber?.id === b.id ? "text-shop-gold" : "text-shop-text"}`}>{b.name}</p>
              <p className="text-shop-muted text-xs mt-0.5">{b.specialty}</p>
            </div>
          </button>
        ))}
      </div>

      {/* No preference option */}
      <button
        onClick={() => set("barber", { id: "any", name: "Any Available", specialty: "" })}
        className={`flex items-center gap-3 text-sm transition-colors ${
          booking.barber?.id === "any" ? "text-shop-gold" : "text-shop-muted hover:text-shop-text"
        }`}
      >
        <span className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
          booking.barber?.id === "any" ? "border-shop-gold bg-shop-gold" : "border-shop-border"
        }`}>
          {booking.barber?.id === "any" && <span className="text-shop-bg text-[10px] font-bold">✓</span>}
        </span>
        No preference — surprise me
      </button>
    </div>
  );
}

function StepDateTime({ booking, set }) {
  return (
    <div>
      <h2 className="font-playfair text-3xl md:text-4xl font-bold text-shop-text mb-2">Date & time</h2>
      <p className="text-shop-muted text-sm mb-8">Pick a date (Sundays are by appointment only). Then choose a slot.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <p className="eyebrow mb-4">Select date</p>
          <Calendar value={booking.date} onChange={d => set("date", d)} />
          {booking.date && (
            <p className="text-shop-gold text-xs mt-4 tracking-wide">
              {new Date(booking.date + "T00:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          )}
        </div>
        <div>
          <p className="eyebrow mb-4">Select time</p>
          {booking.date ? (
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(t => (
                <button
                  key={t}
                  onClick={() => set("time", t)}
                  className={`py-2.5 text-xs tracking-wide border transition-all duration-150 ${
                    booking.time === t
                      ? "border-shop-gold bg-shop-gold text-shop-bg font-semibold"
                      : "border-shop-border text-shop-muted hover:border-shop-muted hover:text-shop-text"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-shop-muted text-sm">Choose a date first.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StepInfo({ booking, set, onSubmit }) {
  return (
    <div>
      <h2 className="font-playfair text-3xl md:text-4xl font-bold text-shop-text mb-2">Your information</h2>
      <p className="text-shop-muted text-sm mb-8">We'll send your confirmation here.</p>

      <div className="max-w-xl grid grid-cols-1 gap-5">
        <div className="grid grid-cols-2 gap-5">
          <Field label="First name" required>
            <input className="booking-input" placeholder="Marcus" value={booking.firstName || ""} onChange={e => set("firstName", e.target.value)} required />
          </Field>
          <Field label="Last name" required>
            <input className="booking-input" placeholder="Reid" value={booking.lastName || ""} onChange={e => set("lastName", e.target.value)} required />
          </Field>
        </div>
        <Field label="Email" required>
          <input type="email" className="booking-input" placeholder="you@email.com" value={booking.email || ""} onChange={e => set("email", e.target.value)} required />
        </Field>
        <Field label="Phone number">
          <input type="tel" className="booking-input" placeholder="+1 (514) 000-0000" value={booking.phone || ""} onChange={e => set("phone", e.target.value)} />
        </Field>
        <Field label="Anything we should know?">
          <textarea className="booking-input resize-none" rows={3} placeholder="Style references, hair concerns…" value={booking.notes || ""} onChange={e => set("notes", e.target.value)} />
        </Field>

        {/* Booking summary */}
        <div className="bg-shop-surface border border-shop-border p-5 space-y-2">
          <p className="eyebrow text-shop-gold mb-3">Your booking summary</p>
          <SummaryRow label="Service" value={booking.service?.name} />
          <SummaryRow label="Barber" value={booking.barber?.name} extra={booking.location} />
          <SummaryRow label="Date" value={booking.date ? new Date(booking.date + "T00:00:00").toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" }) : null} />
          <SummaryRow label="Time" value={booking.time} />
          <div className="pt-2 border-t border-shop-border flex items-center justify-between">
            <span className="text-shop-muted text-xs">Estimated total</span>
            <span className="font-playfair font-bold text-shop-gold">{booking.service?.price || "—"}</span>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <span className={`mt-0.5 w-4 h-4 shrink-0 border flex items-center justify-center transition-colors ${
            booking.terms ? "border-shop-gold bg-shop-gold" : "border-shop-border group-hover:border-shop-muted"
          }`}>
            {booking.terms && <span className="text-shop-bg text-[10px] font-bold">✓</span>}
          </span>
          <input type="checkbox" checked={!!booking.terms} onChange={e => set("terms", e.target.checked)} className="sr-only" />
          <span className="text-shop-muted text-xs leading-relaxed">
            I agree to the cancellation policy — appointments cancelled less than 2 hours prior may incur a fee.
          </span>
        </label>

        <button
          onClick={onSubmit}
          disabled={!booking.terms || !booking.firstName || !booking.lastName || !booking.email}
          className="bg-shop-gold text-shop-bg px-10 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-shop-gold-light transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, extra }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-shop-muted text-xs">{label}</span>
      <span className="text-shop-text text-xs">{value || "—"}{extra ? ` · ${extra}` : ""}</span>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs tracking-wide text-shop-muted uppercase">
        {label}{required && <span className="text-shop-gold ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Calendar / email helpers ─────────────────────────────────────────────────

function googleCalendarUrl(booking) {
  if (!booking.date || !booking.time) return "#";
  const raw = booking.time.replace(" AM", "").replace(" PM", "");
  let [h, m] = raw.split(":").map(Number);
  if (booking.time.includes("PM") && h !== 12) h += 12;
  if (booking.time.includes("AM") && h === 12) h = 0;
  const pad = (n) => String(n).padStart(2, "0");
  const base = booking.date.replace(/-/g, "");
  const start = base + "T" + pad(h) + pad(m || 0) + "00";
  const end   = base + "T" + pad((h + 1) % 24) + pad(m || 0) + "00";
  const title = encodeURIComponent("The Chair — " + (booking.service?.name || "Appointment"));
  const loc   = encodeURIComponent(booking.location === "Toronto" ? "247 King West, Toronto ON" : "519 Rue Rachel E, Montreal QC");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + title + "&dates=" + start + "/" + end + "&location=" + loc;
}

function downloadICS(booking) {
  if (!booking.date || !booking.time) return;
  const raw = booking.time.replace(" AM", "").replace(" PM", "");
  let [h, m] = raw.split(":").map(Number);
  if (booking.time.includes("PM") && h !== 12) h += 12;
  if (booking.time.includes("AM") && h === 12) h = 0;
  const pad = (n) => String(n).padStart(2, "0");
  const base = booking.date.replace(/-/g, "");
  const dt    = base + "T" + pad(h) + pad(m || 0) + "00";
  const dtEnd = base + "T" + pad((h + 1) % 24) + pad(m || 0) + "00";
  const loc = booking.location === "Toronto" ? "247 King West\\, Toronto ON" : "519 Rue Rachel E\\, Montreal QC";
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0",
    "BEGIN:VEVENT",
    "DTSTART:" + dt, "DTEND:" + dtEnd,
    "SUMMARY:The Chair — " + (booking.service?.name || "Appointment"),
    "LOCATION:" + loc,
    "DESCRIPTION:Barber: " + (booking.barber?.name || "Any"),
    "END:VEVENT", "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "the-chair-appointment.ics";
  a.click();
}

function sendConfirmationEmail(booking) {
  // Configure at emailjs.com — replace these three values:
  // const SERVICE_ID  = "YOUR_SERVICE_ID";
  // const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
  // const PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
  // emailjs.send(SERVICE_ID, TEMPLATE_ID, { to_email: booking.email, ... }, PUBLIC_KEY);
  console.log("Booking confirmed:", booking);
}

// ─── Confirmed screen ─────────────────────────────────────────────────────────

function Confirmed({ booking }) {
  const dateStr = booking.date
    ? new Date(booking.date + "T00:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })
    : "";

  return (
    <div
      className="min-h-screen bg-shop-bg flex items-center justify-center px-6"
      style={{ animation: "fadein 0.6s ease forwards" }}
    >
      <div className="max-w-md w-full text-center">
        <div className="text-shop-gold text-5xl mb-6">✓</div>
        <h1 className="font-playfair text-4xl font-bold text-shop-text mb-4">You're booked in.</h1>
        <p className="text-shop-muted text-sm mb-1">{booking.service?.name} with {booking.barber?.name}</p>
        <p className="text-shop-muted text-sm mb-1">{booking.location} location</p>
        <p className="text-shop-muted text-sm mb-6">{dateStr} at {booking.time}</p>
        <p className="text-shop-muted text-xs mb-10">
          Confirmation sent to <span className="text-shop-text">{booking.email}</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a
            href={googleCalendarUrl(booking)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-shop-border text-shop-muted px-6 py-3 text-xs tracking-widest uppercase hover:border-shop-gold hover:text-shop-gold transition-all duration-200"
          >
            + Google Calendar
          </a>
          <button
            onClick={() => downloadICS(booking)}
            className="flex items-center justify-center gap-2 border border-shop-border text-shop-muted px-6 py-3 text-xs tracking-widest uppercase hover:border-shop-gold hover:text-shop-gold transition-all duration-200"
          >
            + Apple / Outlook (.ics)
          </button>
        </div>

        <Link
          to="/"
          className="inline-block bg-shop-gold text-shop-bg px-10 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-shop-gold-light transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const stepVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.22, 0.61, 0.36, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.24, ease: [0.22, 0.61, 0.36, 1] } }),
};

export default function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [booking, setBooking] = useState({ location: "Toronto" });

  const set = (key, val) => setBooking(p => ({ ...p, [key]: val }));

  const goTo = (next) => { setDir(next > step ? 1 : -1); setStep(next); };

  const canNext = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.barber;
    if (step === 2) return !!booking.date && !!booking.time;
    return true;
  };

  if (confirmed) return <Confirmed booking={booking} />;

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">

      {/* Top bar */}
      <div className="border-b border-shop-border px-6 md:px-[5%] py-4 flex items-center justify-between">
        <Link to="/" className="font-playfair text-shop-text font-bold tracking-tight hover:text-shop-gold transition-colors">
          THE CHAIR <span className="text-shop-gold text-xs">✦</span>
        </Link>
        <button onClick={() => navigate(-1)} className="text-shop-muted text-xs tracking-widest uppercase hover:text-shop-text transition-colors">
          ← Back
        </button>
      </div>

      {/* Progress bar */}
      <div className="border-b border-shop-border px-6 md:px-[5%]">
        <div className="flex items-center gap-0 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center shrink-0">
              <button
                onClick={() => i < step && goTo(i)}
                disabled={i > step}
                className={`py-4 px-4 md:px-6 text-xs tracking-widest uppercase flex items-center gap-2 transition-colors border-b-2 -mb-px ${
                  i === step
                    ? "border-shop-gold text-shop-gold"
                    : i < step
                    ? "border-transparent text-shop-muted hover:text-shop-text cursor-pointer"
                    : "border-transparent text-shop-border cursor-not-allowed"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  i < step ? "bg-shop-gold text-shop-bg" : i === step ? "border border-shop-gold text-shop-gold" : "border border-shop-border text-shop-border"
                }`}>
                  {i < step ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < STEPS.length - 1 && <span className="text-shop-border text-xs mx-1 shrink-0">›</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 md:px-[5%] py-10 md:py-14 max-w-5xl w-full mx-auto overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {step === 0 && <StepService booking={booking} set={set} />}
            {step === 1 && <StepBarber booking={booking} set={set} />}
            {step === 2 && <StepDateTime booking={booking} set={set} />}
            {step === 3 && <StepInfo booking={booking} set={set} onSubmit={() => { setConfirmed(true); sendConfirmationEmail(booking); }} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      {step < 3 && (
        <div className="border-t border-shop-border px-6 md:px-[5%] py-5 flex items-center justify-between">
          <button
            onClick={() => step === 0 ? navigate(-1) : goTo(step - 1)}
            className="text-shop-muted text-xs tracking-widest uppercase hover:text-shop-text transition-colors"
          >
            ← {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={() => goTo(step + 1)}
            disabled={!canNext()}
            className="bg-shop-gold text-shop-bg px-8 py-3 text-xs tracking-widest uppercase font-semibold hover:bg-shop-gold-light transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
