"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../lib/gsap";

const SERVICES = [
  "Classic Haircut",
  "Fade & Taper",
  "Beard Trim & Shape",
  "Haircut + Beard Combo",
  "Head Shave",
  "Hair Colour / Highlights",
  "Kids Cut (under 12)",
];

const BARBERS = {
  Toronto: ["Any Available", "Marcus", "Jordan", "Dev"],
  Montreal: ["Any Available", "Antoine", "Karim", "Luca"],
};

export function BookingForm() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const formRef = useRef(null);

  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: "", phone: "",
    location: "", service: "", barber: "",
    date: "", time: "", clientType: "", message: "",
    terms: false,
  });

  const set = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  useGSAP(() => {
    gsap.fromTo(headRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.1,
        ease: "cubic-bezier(0.22,0.61,0.36,1)",
        scrollTrigger: { trigger: headRef.current, start: "top 85%", once: true },
      }
    );
    gsap.fromTo(formRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, ease: "cubic-bezier(0.22,0.61,0.36,1)",
        scrollTrigger: { trigger: formRef.current, start: "top 85%", once: true },
        delay: 0.2,
      }
    );
  }, { scope: sectionRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section ref={sectionRef} className="bg-shop-bg px-6 md:px-[5%] py-20 md:py-28 border-t border-shop-border">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Left: header + info */}
          <div ref={headRef}>
            <span className="eyebrow opacity-0">Appointments</span>
            <span className="gold-rule mt-3 opacity-0" />
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-shop-text leading-tight mb-6 opacity-0">
              Book your<br />chair.
            </h2>
            <p className="text-shop-muted text-sm leading-relaxed mb-10 max-w-xs opacity-0">
              Fill out the form and we'll confirm your slot within the hour. Same-day bookings welcome.
            </p>

            <div className="space-y-6 opacity-0">
              <div>
                <p className="eyebrow text-shop-gold mb-1">Toronto</p>
                <p className="text-shop-muted text-sm">247 King West, Toronto ON</p>
                <p className="text-shop-muted text-sm">+1 (416) 555-0147</p>
              </div>
              <div>
                <p className="eyebrow text-shop-gold mb-1">Montreal</p>
                <p className="text-shop-muted text-sm">519 Rue Rachel E, Montréal QC</p>
                <p className="text-shop-muted text-sm">+1 (514) 555-0193</p>
              </div>
              <div>
                <p className="eyebrow text-shop-gold mb-1">Hours</p>
                <p className="text-shop-muted text-sm">Mon – Sat · 9 am – 8 pm</p>
                <p className="text-shop-muted text-sm">Sunday · by appointment</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div ref={formRef} className="opacity-0">
            {submitted ? (
              <div className="flex flex-col items-start gap-4 py-16">
                <span className="text-shop-gold text-3xl">✓</span>
                <h3 className="font-playfair text-3xl font-bold text-shop-text">You're booked in.</h3>
                <p className="text-shop-muted text-sm leading-relaxed max-w-sm">
                  We'll confirm your appointment by email within the hour. See you at the chair.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs tracking-widest uppercase text-shop-gold hover:text-shop-gold-light transition-colors"
                >
                  ← Book another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="First name" required>
                    <input type="text" value={form.firstName} onChange={set("firstName")}
                      className="booking-input" placeholder="Marcus" required />
                  </Field>
                  <Field label="Last name" required>
                    <input type="text" value={form.lastName} onChange={set("lastName")}
                      className="booking-input" placeholder="Reid" required />
                  </Field>
                </div>

                {/* Contact row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Email" required>
                    <input type="email" value={form.email} onChange={set("email")}
                      className="booking-input" placeholder="you@email.com" required />
                  </Field>
                  <Field label="Phone number">
                    <input type="tel" value={form.phone} onChange={set("phone")}
                      className="booking-input" placeholder="+1 (514) 000-0000" />
                  </Field>
                </div>

                {/* Location + Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Location" required>
                    <select
                      value={form.location}
                      onChange={(e) => { set("location")(e); setLocation(e.target.value); set("barber")({ target: { value: "" } }); }}
                      className="booking-input" required
                    >
                      <option value="">Select location…</option>
                      <option value="Toronto">Toronto — King West</option>
                      <option value="Montreal">Montreal — Rue Rachel</option>
                    </select>
                  </Field>
                  <Field label="Service" required>
                    <select value={form.service} onChange={set("service")} className="booking-input" required>
                      <option value="">Select service…</option>
                      {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Barber */}
                <Field label="Preferred barber">
                  <select value={form.barber} onChange={set("barber")} className="booking-input" disabled={!location}>
                    <option value="">{location ? "Select barber…" : "Choose a location first"}</option>
                    {(BARBERS[location] || []).map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>

                {/* Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Preferred date" required>
                    <input type="date" value={form.date} onChange={set("date")}
                      className="booking-input" required
                      min={new Date().toISOString().split("T")[0]} />
                  </Field>
                  <Field label="Preferred time" required>
                    <select value={form.time} onChange={set("time")} className="booking-input" required>
                      <option value="">Select time…</option>
                      {["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Client type */}
                <Field label="Are you a…">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {["First-time client", "Returning client", "Referral", "Gift certificate", "Partnership inquiry", "Other"].map((opt) => (
                      <label key={opt} className={`flex items-center gap-2.5 cursor-pointer group`}>
                        <span className={`w-4 h-4 shrink-0 border flex items-center justify-center transition-colors ${
                          form.clientType === opt ? "border-shop-gold bg-shop-gold" : "border-shop-border bg-transparent group-hover:border-shop-muted"
                        }`}>
                          {form.clientType === opt && <span className="text-shop-bg text-[10px] font-bold">✓</span>}
                        </span>
                        <input type="radio" name="clientType" value={opt} checked={form.clientType === opt}
                          onChange={set("clientType")} className="sr-only" />
                        <span className="text-shop-muted text-xs">{opt}</span>
                      </label>
                    ))}
                  </div>
                </Field>

                {/* Message */}
                <Field label="Anything else we should know?">
                  <textarea value={form.message} onChange={set("message")}
                    className="booking-input resize-none" rows={4}
                    placeholder="Style references, hair concerns, accessibility needs…" />
                </Field>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <span className={`mt-0.5 w-4 h-4 shrink-0 border flex items-center justify-center transition-colors ${
                    form.terms ? "border-shop-gold bg-shop-gold" : "border-shop-border group-hover:border-shop-muted"
                  }`}>
                    {form.terms && <span className="text-shop-bg text-[10px] font-bold">✓</span>}
                  </span>
                  <input type="checkbox" checked={form.terms} onChange={set("terms")} className="sr-only" required />
                  <span className="text-shop-muted text-xs leading-relaxed">
                    I agree to the cancellation policy — appointments cancelled less than 2 hours prior may incur a fee.
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-2 bg-shop-gold text-shop-bg px-10 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-shop-gold-light transition-all duration-200 w-full sm:w-auto"
                >
                  Request Appointment
                </button>

              </form>
            )}
          </div>
        </div>
      </div>
    </section>
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
