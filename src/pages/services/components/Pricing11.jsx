"use client";

import React from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    label: "Single Visit",
    price: "$45",
    sub: "Per service",
    features: [
      "Classic cut with detail work",
      "Beard trim available add-on",
      "Hot towel finish included",
    ],
    cta: "Book now",
    highlight: false,
  },
  {
    label: "The Package",
    price: "$70",
    sub: "Save $5 — best value",
    features: [
      "Cut + beard trim combo",
      "Straight razor shave option",
      "Premium hot towel service",
      "Line design & detail work",
      "Priority booking slot",
    ],
    cta: "Book the package",
    highlight: true,
  },
];

export function Pricing11() {
  return (
    <section className="bg-shop-surface px-6 md:px-[5%] py-16 md:py-24">
      <div className="container max-w-3xl">
        <div className="mb-14">
          <span className="eyebrow">Packages</span>
          <span className="gold-rule mt-3" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-shop-text">
            Service packages
          </h2>
          <p className="text-shop-muted text-sm mt-3">Single services or bundled, your choice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(({ label, price, sub, features, cta, highlight }) => (
            <div
              key={label}
              className={`p-8 flex flex-col ${
                highlight
                  ? "bg-shop-elevated border border-shop-gold"
                  : "bg-shop-bg border border-shop-border"
              }`}
            >
              {highlight && (
                <span className="eyebrow text-shop-gold mb-4">Most Popular</span>
              )}
              <span className="eyebrow text-shop-muted mb-2">{label}</span>
              <p className="font-playfair text-6xl font-bold text-shop-text mb-1">{price}</p>
              <p className="text-shop-muted text-sm mb-8">{sub}</p>

              <div className="section-divider mb-8" />

              <ul className="space-y-3 flex-1 mb-10">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-shop-muted">
                    <span className="text-shop-gold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className={`block text-center py-3.5 text-xs tracking-widest uppercase font-semibold transition-all duration-200 ${
                  highlight
                    ? "bg-shop-gold text-shop-bg hover:bg-shop-gold-light"
                    : "border border-shop-border text-shop-muted hover:border-shop-gold hover:text-shop-gold"
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
