"use client";

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../lib/gsap";

const locations = [
  {
    city: "Toronto",
    address: "247 King West, Toronto ON M5H 2R2",
    phone: "+1 (416) 555-0147",
    hours: "Mon–Sat 9am–8pm · Sun by appointment",
    img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80&auto=format&fit=crop",
    maps: "https://maps.google.com",
    dir: -1, // slides from left
  },
  {
    city: "Montreal",
    address: "519 Rue Rachel E, Montréal QC H2J 2H3",
    phone: "+1 (514) 555-0193",
    hours: "Mon–Sat 9am–8pm · Sun by appointment",
    img: "https://images.unsplash.com/photo-1519121785383-3229633bb75b?w=800&q=80&auto=format&fit=crop",
    maps: "https://maps.google.com",
    dir: 1, // slides from right
  },
];

export function Contact28() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const lineRef = useRef(null);
  const cardRefs = useRef([]);
  useGSAP(() => {
    // Headline
    gsap.fromTo(headlineRef.current,
      { y: 24, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: "cubic-bezier(0.22,0.61,0.36,1)",
        scrollTrigger: { trigger: headlineRef.current, start: "top 88%", once: true },
      }
    );

    // "Map line" drawing between the two cities
    gsap.fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      {
        scaleX: 1, ease: "none",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 80%",
          end: "top 55%",
          scrub: true,
        },
      }
    );

    // City cards slide in from opposite sides
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const dir = locations[i].dir;
      gsap.fromTo(card,
        { x: dir * 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: "cubic-bezier(0.22,0.61,0.36,1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
          delay: i * 0.15,
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-shop-surface px-6 md:px-[5%] py-20 md:py-28">
      <div className="container">
        <div ref={headlineRef} className="mb-12 opacity-0">
          <span className="eyebrow">Locations</span>
          <span className="gold-rule mt-3" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-shop-text">
            Find us
          </h2>
          <p className="text-shop-muted text-sm mt-3 leading-relaxed">
            Open Monday through Saturday. Sunday by appointment only.
          </p>
        </div>

        {/* Map connecting line */}
        <div
          ref={lineRef}
          className="hidden md:block h-px bg-shop-gold mb-8 origin-left"
          style={{ transform: "scaleX(0)" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-shop-border">
          {locations.map(({ city, address, phone, hours, img, maps }, i) => (
            <div
              key={city}
              ref={(el) => (cardRefs.current[i] = el)}
              className="bg-shop-surface group opacity-0"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={img}
                  alt={`${city} location`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-6 md:p-8 border-t border-shop-border">
                <h3 className="font-playfair text-2xl font-bold text-shop-text mb-3">{city}</h3>
                <p className="text-shop-muted text-sm mb-1">{address}</p>
                <p className="text-shop-muted text-sm mb-1">{phone}</p>
                <p className="text-shop-muted text-sm mb-6">{hours}</p>
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-widest uppercase text-shop-gold hover:text-shop-gold-light transition-colors flex items-center gap-2 group/link"
                >
                  Get directions
                  <span className="inline-block group-hover/link:translate-x-1 transition-transform duration-200">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
