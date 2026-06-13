"use client";

import React from "react";
import { Link } from "react-router-dom";

const team = [
  {
    name: "Marcus Webb",
    title: "Senior Barber",
    specialty: "Fades & Precision Work",
    years: "12 years",
    bio: "Quiet, focused, no wasted motion. Fades, precision cuts, and beard sculpting are his language.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop&crop=face",
    featured: true,
  },
  {
    name: "James Ortega",
    title: "Barber",
    specialty: "Classic & Modern Cuts",
    years: "9 years",
    bio: "Master of classic cuts and modern styles. Speaks English and Spanish.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop&crop=face",
  },
  {
    name: "David Liu",
    title: "Barber",
    specialty: "Texture & Longer Styles",
    years: "7 years",
    bio: "Detail-oriented and patient. Specializes in textured hair and longer styles. Fluent in Mandarin.",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop&crop=face",
  },
  {
    name: "Alex Kowalski",
    title: "Barber",
    specialty: "Fades & Modern Shapes",
    years: "5 years",
    bio: "Sharp on fades and modern shapes. Brings energy, listens hard to what you want.",
    img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80&auto=format&fit=crop&crop=face",
  },
  {
    name: "Ryan Thompson",
    title: "Barber",
    specialty: "Beard & Grooming",
    years: "6 years",
    bio: "Calm and methodical. Specializes in beard work and grooming. Takes real pride in the craft.",
    img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80&auto=format&fit=crop&crop=face",
  },
];

export function Layout524() {
  const [featured, ...rest] = team;
  return (
    <section className="bg-shop-bg px-6 md:px-[5%] py-16 md:py-24">
      <div className="container">
        {/* Featured barber */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-shop-border mb-px">
          <div className="bg-shop-bg overflow-hidden aspect-[4/3] lg:aspect-auto">
            <img
              src={featured.img}
              alt={featured.name}
              className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="bg-shop-surface p-8 md:p-12 flex flex-col justify-center">
            <span className="eyebrow text-shop-gold mb-4">Featured</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-shop-text mb-2">
              {featured.name}
            </h2>
            <p className="eyebrow text-shop-muted mb-6">{featured.specialty} · {featured.years}</p>
            <span className="gold-rule" />
            <p className="text-shop-muted text-sm leading-relaxed mb-8">{featured.bio}</p>
            <Link
              to="/contact"
              className="inline-block bg-shop-gold text-shop-bg px-8 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-shop-gold-light transition-all duration-200 self-start"
            >
              Book with Marcus
            </Link>
          </div>
        </div>

        {/* Rest of team */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-shop-border">
          {rest.map(({ name, specialty, years, bio, img }) => (
            <div key={name} className="bg-shop-bg group">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 border-t border-shop-border">
                <h3 className="font-playfair text-lg font-bold text-shop-text mb-1">{name}</h3>
                <p className="eyebrow text-shop-muted mb-3">{specialty}</p>
                <p className="text-shop-muted text-xs leading-relaxed">{bio}</p>
                <span className="block mt-4 h-px w-0 bg-shop-gold group-hover:w-full transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
