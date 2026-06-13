"use client";

import React, { useRef, useEffect } from "react";

const images = [
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&q=80&auto=format&fit=crop", caption: "The shop, King West", span: "col-span-2 row-span-2" },
  { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=80&auto=format&fit=crop", caption: "Fade in progress", span: "" },
  { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=80&auto=format&fit=crop", caption: "Clean lines", span: "" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80&auto=format&fit=crop", caption: "Every chair, ready", span: "" },
  { src: "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?w=900&q=80&auto=format&fit=crop", caption: "Straight razor work", span: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&q=80&auto=format&fit=crop", caption: "Precision beard work", span: "" },
];

export function Gallery10() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".gallery-card");
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("gallery-card--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    cards.forEach((card, i) => {
      card.style.transitionDelay = (i * 80) + "ms";
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-shop-bg px-6 md:px-[5%] py-20 md:py-28">
      {/* Header */}
      <div className="mb-14">
        <span className="eyebrow">Gallery</span>
        <span className="gold-rule mt-3" />
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-shop-text">
          The work.
        </h2>
        <p className="text-shop-muted text-sm mt-3 max-w-xs leading-relaxed">
          Real cuts. Real craft. Real space.
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "280px",
        }}
      >
        {images.map(({ src, caption, span }, i) => (
          <div
            key={i}
            className={"gallery-card relative overflow-hidden group " + span}
          >
            <img
              src={src}
              alt={caption}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-shop-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="absolute bottom-4 left-4 text-shop-text text-xs tracking-wide font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transition-transform">
              {caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
