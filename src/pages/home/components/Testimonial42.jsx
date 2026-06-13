"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../../lib/gsap";
import { BiSolidStar } from "react-icons/bi";

const testimonials = [
  { quote: "Best barber I've found in the city. Knows exactly what to do without a lot of talk.", name: "Marcus T.", role: "Marketing Director" },
  { quote: "Been coming here for two years. Consistent, professional, and they respect your time.", name: "David R.", role: "Software Engineer" },
  { quote: "The fade work is exceptional. This is the place if you care about your appearance.", name: "James L.", role: "Finance Analyst" },
  { quote: "No pretense, no nonsense. Just a good cut and a barber who takes pride in his work.", name: "Alex M.", role: "Architect" },
  { quote: "Switched from my old barber of 5 years and never looked back. Genuinely that good.", name: "Chris V.", role: "Creative Director" },
];

export function Testimonial42() {
  const sectionRef = useRef(null);
  const quoteRefs = useRef([]);
  const nameRefs = useRef([]);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const section = sectionRef.current;
    const n = testimonials.length;

    // Set all quotes invisible except first
    quoteRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30 });
    });
    nameRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: i === 0 ? 1 : 0 });
    });

    // Build a timeline for sequential transitions
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${n * 320}`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const idx = Math.min(Math.floor(self.progress * n), n - 1);
          setActive(idx);
        },
      },
    });

    for (let i = 0; i < n - 1; i++) {
      const outQuote = quoteRefs.current[i];
      const inQuote = quoteRefs.current[i + 1];
      const outName = nameRefs.current[i];
      const inName = nameRefs.current[i + 1];

      if (!outQuote || !inQuote) continue;

      tl.to(outQuote, { opacity: 0, x: -40, duration: 0.4, ease: "power2.in" }, i)
        .to(outName, { opacity: 0, duration: 0.3, ease: "power2.in" }, i)
        .fromTo(inQuote, { opacity: 0, y: 32 }, { opacity: 1, y: 0, x: 0, duration: 0.5, ease: "cubic-bezier(0.22,0.61,0.36,1)" }, i + 0.35)
        .fromTo(inName, { opacity: 0 }, { opacity: 1, duration: 0.35 }, i + 0.55);
    }

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-shop-surface overflow-hidden">
      <div className="min-h-screen flex flex-col justify-center px-6 md:px-[5%] py-20">
        <div className="container max-w-4xl">

          {/* Fixed rating line */}
          <div className="flex items-center gap-3 mb-12">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <BiSolidStar key={i} className="size-4 text-shop-gold" />
              ))}
            </div>
            <span className="eyebrow text-shop-muted">4.9 · 287 verified reviews</span>
          </div>

          {/* Quote stack — all stacked, GSAP controls visibility */}
          <div className="relative min-h-[14rem] mb-12">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                ref={(el) => (quoteRefs.current[i] = el)}
                className="absolute inset-0 font-playfair text-2xl md:text-4xl lg:text-5xl font-bold text-shop-text leading-tight"
                style={{ opacity: 0 }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            ))}
          </div>

          {/* Name stack */}
          <div className="relative h-12">
            {testimonials.map((t, i) => (
              <div
                key={i}
                ref={(el) => (nameRefs.current[i] = el)}
                className="absolute inset-0 flex items-center gap-4"
                style={{ opacity: 0 }}
              >
                <span className="gold-rule !mb-0 !w-6 shrink-0" />
                <div>
                  <p className="text-shop-text text-sm font-semibold">{t.name}</p>
                  <p className="eyebrow text-shop-muted mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-10">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`block h-px transition-all duration-300 ${i === active ? "w-8 bg-shop-gold" : "w-3 bg-shop-border"}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
