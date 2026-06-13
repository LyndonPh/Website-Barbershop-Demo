"use client";

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../../lib/gsap";

const stats = [
  { stat: "4.9", label: "Google Rating", from: 4.2, decimals: 1 },
  { stat: "6+", label: "Years in the Chair", from: 0, decimals: 0 },
  { stat: "2", label: "City Locations", from: 0, decimals: 0 },
  { stat: "30K+", label: "Clients Served", from: 0, decimals: 0 },
];

export function Header145() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const statNumberRefs = useRef([]);

  useGSAP(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;

    // ── Load-in sequence ──────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: "cubic-bezier(0.22,0.61,0.36,1)" } });

    tl.fromTo(line1Ref.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.2
    )
    .fromTo(line2Ref.current,
      { y: 60, opacity: 0, letterSpacing: "0.12em" },
      { y: 0, opacity: 1, letterSpacing: "-0.01em", duration: 0.9 },
      0.45
    )
    .fromTo(subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.75
    )
    .fromTo(ctaRef.current.children,
      { scale: 0.95, opacity: 0, y: 10 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      0.9
    );

    // ── Hero background parallax on scroll ────────────────
    gsap.to(bg, {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // ── Hero fade+blur as user scrolls away ───────────────
    gsap.to(section.querySelector(".hero-content"), {
      opacity: 0.2,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "40% top",
        end: "bottom top",
        scrub: true,
      },
    });

    // ── Stats stagger in + count-up ───────────────────────
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 88%",
      onEnter: () => {
        gsap.fromTo(
          statsRef.current.children,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: "cubic-bezier(0.22,0.61,0.36,1)" }
        );

        // Count-up each number
        statNumberRefs.current.forEach((el, i) => {
          if (!el) return;
          const s = stats[i];
          const isK = s.stat.includes("K");
          const isPlus = s.stat.includes("+");
          const end = parseFloat(s.stat.replace(/[K+]/g, ""));
          const counter = { val: s.from };

          gsap.to(counter, {
            val: end,
            duration: 2.8,
            ease: "power2.out",
            onUpdate() {
              const formatted = s.decimals > 0 ? counter.val.toFixed(s.decimals) : Math.round(counter.val);
              el.textContent = formatted + (isK ? "K+" : isPlus ? "+" : "");
            },
          });
        });
      },
      once: true,
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-shop-bg overflow-hidden flex flex-col">
      {/* Background image with parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgRef}
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1800&q=80&auto=format&fit=crop"
          alt="Barbershop interior"
          className="w-full h-[130%] object-cover -top-[15%] absolute"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-shop-bg via-shop-bg/80 to-shop-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-shop-bg via-transparent to-transparent" />
      </div>

      {/* Foreground content */}
      <div className="hero-content relative z-10 flex flex-col justify-end flex-1 px-6 md:px-[5%] pb-16 md:pb-24 pt-32">
        <div className="max-w-3xl">
          <span className="eyebrow">Montreal · Toronto · Est. 2018</span>
          <span className="gold-rule mt-4" />

          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-shop-text mb-0">
            <span ref={line1Ref} className="block opacity-0">Sharp cuts.</span>
            <span ref={line2Ref} className="block text-shop-gold italic opacity-0">Trusted hands.</span>
          </h1>

          <p ref={subtitleRef} className="text-shop-muted text-base md:text-lg max-w-md mt-6 mb-10 leading-relaxed font-light opacity-0">
            Book with a barber who has earned it. We keep things precise, honest,
            and on your schedule.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <Link
              to="/book"
              className="inline-block bg-shop-gold text-shop-bg px-8 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-shop-gold-light transition-all duration-200 opacity-0"
            >
              Book Now
            </Link>
            <Link
              to="/book"
              className="inline-block border border-shop-border text-shop-muted px-8 py-3.5 text-xs tracking-widest uppercase hover:border-shop-muted hover:text-shop-text transition-all duration-200 opacity-0"
            >
              Our Services
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div ref={statsRef} className="mt-16 pt-8 border-t border-shop-border flex flex-wrap gap-10">
          {stats.map(({ stat, label }, i) => (
            <div key={label} className="opacity-0">
              <p
                ref={(el) => (statNumberRefs.current[i] = el)}
                className="font-playfair text-2xl font-bold text-shop-gold"
              >
                {stat}
              </p>
              <p className="eyebrow text-shop-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
