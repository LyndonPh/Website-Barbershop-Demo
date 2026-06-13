"use client";

import React from "react";

const items = [
  { name: "Classic Haircut", price: "$35", desc: "Scissor or clipper cut, any length, styled to finish." },
  { name: "Fade", price: "$38", desc: "High, mid, or low — blended clean to the skin." },
  { name: "Beard Trim", price: "$20", desc: "Shape, edge, and define. Hot towel to close." },
  { name: "Straight Razor Shave", price: "$40", desc: "Hot lather, single blade, close finish." },
  { name: "Kid's Cut (under 12)", price: "$25", desc: "Patient, calm, and done right." },
  { name: "Line-up only", price: "$15", desc: "Edge and shape between full cuts." },
];

export function Layout381() {
  return (
    <section className="bg-shop-bg px-6 md:px-[5%] py-16 md:py-24">
      <div className="container">
        <div className="mb-12">
          <span className="eyebrow">Full Menu</span>
          <span className="gold-rule mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-shop-border">
          {items.map(({ name, price, desc }) => (
            <div
              key={name}
              className="bg-shop-bg p-6 md:p-8 flex items-start justify-between gap-4 group hover:bg-shop-surface transition-colors duration-200"
            >
              <div>
                <h3 className="font-playfair text-lg font-bold text-shop-text mb-1">{name}</h3>
                <p className="text-shop-muted text-sm leading-relaxed">{desc}</p>
              </div>
              <span className="font-playfair text-xl font-bold text-shop-gold shrink-0">{price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
