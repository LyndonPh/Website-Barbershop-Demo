"use client";

import React from "react";

export function Header64() {
  return (
    <section className="relative bg-shop-bg pt-32 pb-16 md:pb-20 px-6 md:px-[5%] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=1600&q=70&auto=format&fit=crop"
          alt="Services"
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      <div className="relative z-10 container max-w-2xl">
        <span className="eyebrow">Services & Pricing</span>
        <span className="gold-rule mt-3" />
        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-shop-text leading-[1.05] tracking-tight">
          What we offer
        </h1>
        <p className="text-shop-muted text-base md:text-lg mt-6 max-w-md leading-relaxed font-light">
          No surprises. No hidden fees. Just clean cuts and honest prices.
        </p>
      </div>
    </section>
  );
}
