"use client";

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../../lib/gsap";

const services = [
  {
    tag: "Classic",
    name: "Cut & Fade",
    price: "$35",
    desc: "Scissor or clipper. Any length. Finished with a straight razor line.",
    img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80&auto=format&fit=crop",
  },
  {
    tag: "Beard",
    name: "Trim, Shape & Line",
    price: "$20",
    desc: "Clean edges, defined shape, hot towel to close.",
    img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80&auto=format&fit=crop",
  },
  {
    tag: "Signature",
    name: "Straight Razor Shave",
    price: "$40",
    desc: "Hot lather, single-pass straight razor. The full experience.",
    img: "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?w=800&q=80&auto=format&fit=crop",
  },
];

export function Layout394() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const ruleRef = useRef(null);
  const cardsRef = useRef([]);
  const priceRefs = useRef([]);
  const arrowRefs = useRef([]);

  useGSAP(() => {
    // Title slides in from left
    gsap.fromTo(titleRef.current,
      { x: -40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.7, ease: "cubic-bezier(0.22,0.61,0.36,1)",
        scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
      }
    );

    // Divider draws in horizontally (scroll-linked)
    gsap.fromTo(ruleRef.current,
      { scaleX: 0, transformOrigin: "left" },
      {
        scaleX: 1, ease: "none",
        scrollTrigger: {
          trigger: ruleRef.current,
          start: "top 85%",
          end: "top 65%",
          scrub: true,
        },
      }
    );

    // Cards: staggered fade+rise with mask-reveal clip-path
    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      gsap.fromTo(card,
        { y: 40, opacity: 0, clipPath: "inset(0 100% 0 0)" },
        {
          y: 0, opacity: 1, clipPath: "inset(0 0% 0 0)",
          duration: 0.7, ease: "cubic-bezier(0.22,0.61,0.36,1)",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
          delay: i * 0.12,
        }
      );

      // Price scale snap on enter
      const price = priceRefs.current[i];
      if (price) {
        gsap.fromTo(price,
          { scale: 0.92, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
            delay: i * 0.12 + 0.25,
          }
        );
      }

      // Arrow nudge on enter
      const arrow = arrowRefs.current[i];
      if (arrow) {
        gsap.fromTo(arrow,
          { x: -8, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.4, ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
            delay: i * 0.12 + 0.4,
          }
        );
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-shop-bg px-6 md:px-[5%] py-20 md:py-28">
      <div className="container">
        <div className="mb-14">
          <div ref={titleRef} className="opacity-0">
            <span className="eyebrow">Services</span>
            <span
              ref={ruleRef}
              className="block w-10 h-px bg-shop-gold mt-3 mb-5 origin-left"
              style={{ transform: "scaleX(0)" }}
            />
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-shop-text max-w-sm leading-tight">
              What we do
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-shop-border">
          {services.map(({ tag, name, price, desc, img }, i) => (
            <div
              key={name}
              ref={(el) => (cardsRef.current[i] = el)}
              className="bg-shop-bg group flex flex-col opacity-0"
            >
              <div className="overflow-hidden aspect-[4/3]">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1 border-t border-shop-border">
                <span className="eyebrow text-shop-muted mb-3">{tag}</span>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-playfair text-xl md:text-2xl font-bold text-shop-text leading-snug">
                    {name}
                  </h3>
                  <span
                    ref={(el) => (priceRefs.current[i] = el)}
                    className="font-playfair text-xl font-bold text-shop-gold ml-4 shrink-0 opacity-0"
                  >
                    {price}
                  </span>
                </div>
                <p className="text-shop-muted text-sm leading-relaxed flex-1">{desc}</p>
                <div
                  ref={(el) => (arrowRefs.current[i] = el)}
                  className="mt-6 opacity-0"
                >
                  <Link
                    to="/services"
                    className="text-xs tracking-widest uppercase text-shop-gold hover:text-shop-gold-light transition-colors flex items-center gap-2 group/link"
                  >
                    Book this
                    <span className="inline-block group-hover/link:translate-x-1 transition-transform duration-200">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right">
          <Link
            to="/services"
            className="inline-block border border-shop-border text-shop-muted px-6 py-2.5 text-xs tracking-widest uppercase hover:border-shop-gold hover:text-shop-gold transition-all duration-200"
          >
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}
