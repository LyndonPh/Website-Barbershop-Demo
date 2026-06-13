"use client";

import React from "react";

export function Header64() {
  return (
    <section className="relative bg-shop-bg pt-32 pb-16 md:pb-20 px-6 md:px-[5%] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=1600&q=70&auto=format&fit=crop"
          alt="Barber team"
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      <div className="relative z-10 container max-w-2xl">
        <span className="eyebrow">The Team</span>
        <span className="gold-rule mt-3" />
        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-shop-text leading-[1.05] tracking-tight">
          The hands behind every cut
        </h1>
        <p className="text-shop-muted text-base md:text-lg mt-6 max-w-md leading-relaxed font-light">
          Meet the barbers who shape your look and earn your trust.
        </p>
      </div>
    </section>
  );
}
