"use client";

import React from "react";
import { BiEnvelope, BiPhone, BiLogoInstagram } from "react-icons/bi";
import { Link } from "react-router-dom";

const channels = [
  {
    icon: BiPhone,
    label: "Phone",
    detail: "Call or text us directly",
    value: "+1 (416) 555-0147",
    href: "tel:+14165550147",
  },
  {
    icon: BiEnvelope,
    label: "Email",
    detail: "We reply same day",
    value: "hello@thechairbarber.com",
    href: "mailto:hello@thechairbarber.com",
  },
  {
    icon: BiLogoInstagram,
    label: "Instagram",
    detail: "See our latest work",
    value: "@thechairbarber",
    href: "#",
  },
];

export function Contact13() {
  return (
    <section className="bg-shop-surface px-6 md:px-[5%] py-16 md:py-24">
      <div className="container">
        <div className="mb-12">
          <span className="eyebrow">Reach Out</span>
          <span className="gold-rule mt-3" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-shop-text">
            Get in touch
          </h2>
          <p className="text-shop-muted text-sm mt-3">Questions? We are a message or call away.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-shop-border mb-px">
          {channels.map(({ icon: Icon, label, detail, value, href }) => (
            <div key={label} className="bg-shop-surface p-6 md:p-8 group hover:bg-shop-elevated transition-colors duration-200">
              <Icon className="size-7 text-shop-gold mb-5" />
              <p className="eyebrow text-shop-muted mb-2">{label}</p>
              <p className="text-shop-muted text-sm mb-3">{detail}</p>
              <a
                href={href}
                className="text-shop-text text-sm hover:text-shop-gold transition-colors"
              >
                {value}
              </a>
            </div>
          ))}
        </div>

        {/* Book CTA */}
        <div className="bg-shop-elevated border border-shop-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-shop-text">
              Ready to book?
            </h3>
            <p className="text-shop-muted text-sm mt-2">Slots available this week at both locations.</p>
          </div>
          <Link
            to="/book"
            className="inline-block bg-shop-gold text-shop-bg px-10 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-shop-gold-light transition-all duration-200 shrink-0"
          >
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
}
