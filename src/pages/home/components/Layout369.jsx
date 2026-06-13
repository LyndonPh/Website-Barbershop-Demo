"use client";

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../lib/gsap";

const barbers = [
  { name: "Marcus Webb", specialty: "Fades & Precision", years: "12 yrs", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop&crop=face" },
  { name: "James Ortega", specialty: "Classic & Modern", years: "9 yrs", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop&crop=face" },
  { name: "David Liu", specialty: "Texture & Style", years: "7 yrs", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop&crop=face" },
  { name: "Ryan Thompson", specialty: "Beard & Grooming", years: "6 yrs", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80&auto=format&fit=crop&crop=face" },
];

export function Layout369() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(() => {
    // Headline fade+up
    gsap.fromTo(headlineRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, ease: "cubic-bezier(0.22,0.61,0.36,1)",
        scrollTrigger: { trigger: headlineRef.current, start: "top 88%", once: true },
      }
    );

    // Cards: stagger + slight rotation settling to flat
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const rotateFrom = i % 2 === 0 ? -1.5 : 1.5;
      gsap.fromTo(card,
        { y: 45, opacity: 0, rotation: rotateFrom },
        {
          y: 0, opacity: 1, rotation: 0,
          duration: 0.65, ease: "cubic-bezier(0.22,0.61,0.36,1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          delay: i * 0.1,
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-shop-surface px-6 md:px-[5%] py-20 md:py-28">
      <div className="container">
        <div
          ref={headlineRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6 opacity-0"
        >
          <div>
            <span className="eyebrow">Team</span>
            <span className="gold-rule mt-3" />
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-shop-text leading-tight">
              Meet the barbers
            </h2>
          </div>
          <Link
            to="/team"
            className="inline-block border border-shop-border text-shop-muted px-6 py-2.5 text-xs tracking-widest uppercase hover:border-shop-gold hover:text-shop-gold transition-all duration-200 self-start md:self-auto"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {barbers.map(({ name, specialty, years, img }, i) => (
            <div
              key={name}
              ref={(el) => (cardRefs.current[i] = el)}
              className="group cursor-pointer opacity-0"
            >
              <div className="aspect-[3/4] overflow-hidden mb-4">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-playfair text-base font-bold text-shop-text">{name}</h3>
                  <p className="eyebrow text-shop-muted mt-1">{specialty}</p>
                </div>
                <span className="text-shop-gold text-xs font-sans mt-0.5">{years}</span>
              </div>
              <span className="block mt-2 h-px w-0 bg-shop-gold group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
