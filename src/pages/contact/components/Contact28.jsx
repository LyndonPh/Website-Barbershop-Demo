"use client";

import React from "react";
import { Link } from "react-router-dom";

const locations = [
  {
    city: "Toronto",
    address: "247 King West, Toronto ON M5H 2R2",
    hours: "Mon–Sat 9am–8pm · Sun by appointment",
    img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1000&q=80&auto=format&fit=crop",
    maps: "https://maps.google.com",
    phone: "+1 (416) 555-0147",
  },
  {
    city: "Montreal",
    address: "519 Rue Rachel E, Montréal QC H2J 2H3",
    hours: "Mon–Sat 9am–8pm · Sun by appointment",
    img: "https://images.unsplash.com/photo-1519121785383-3229633bb75b?w=1000&q=80&auto=format&fit=crop",
    maps: "https://maps.google.com",
    phone: "+1 (514) 555-0193",
  },
];

export function Contact28() {
  return (
    <section className="bg-shop-bg px-6 md:px-[5%] py-16 md:py-24">
      <div className="container">
        <div className="mb-12">
          <span className="eyebrow">Our Locations</span>
          <span className="gold-rule mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-shop-border">
          {locations.map(({ city, address, hours, img, maps, phone }) => (
            <div key={city} className="bg-shop-bg group">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={img}
                  alt={`${city} location`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-6 md:p-8 border-t border-shop-border">
                <h3 className="font-playfair text-2xl font-bold text-shop-text mb-4">{city}</h3>
                <div className="space-y-2 mb-6">
                  <p className="text-shop-muted text-sm">{address}</p>
                  <p className="text-shop-muted text-sm">{phone}</p>
                  <p className="text-shop-muted text-sm">{hours}</p>
                </div>
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-widest uppercase text-shop-gold hover:text-shop-gold-light transition-colors flex items-center gap-2"
                >
                  Get directions <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
