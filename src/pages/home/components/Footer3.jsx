"use client";

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { BiLogoInstagram, BiLogoFacebookCircle } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../lib/gsap";

export function Footer3() {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.to(footerRef.current.querySelector(".footer-body"), {
      opacity: 0.7,
      ease: "none",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "bottom bottom",
        end: "bottom 80%",
        scrub: true,
      },
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="bg-shop-bg border-t border-shop-border">
      <div className="footer-body px-6 md:px-[5%] py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10 md:gap-16 pb-10 md:pb-14 border-b border-shop-border">
            <div>
              <p className="font-playfair text-xl font-bold text-shop-text tracking-tight mb-1">THE CHAIR</p>
              <span className="text-shop-gold text-xs">✦</span>
              <p className="text-shop-muted text-sm mt-4 max-w-xs leading-relaxed">
                Premium neighborhood barbershop in Montreal and Toronto. Sharp cuts, trusted hands, no wait.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-shop-muted hover:text-shop-gold transition-colors"><BiLogoInstagram className="size-5" /></a>
                <a href="#" className="text-shop-muted hover:text-shop-gold transition-colors"><BiLogoFacebookCircle className="size-5" /></a>
                <a href="#" className="text-shop-muted hover:text-shop-gold transition-colors"><FaXTwitter className="size-4" /></a>
              </div>
            </div>
            <div>
              <p className="eyebrow text-shop-muted mb-4">Navigate</p>
              <ul className="space-y-3">
                {[{ label: "Services & Pricing", to: "/services" }, { label: "Our Team", to: "/team" }, { label: "Contact & Locations", to: "/contact" }].map(({ label, to }) => (
                  <li key={to}><Link to={to} className="text-shop-muted text-sm hover:text-shop-gold transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-shop-muted mb-4">Contact</p>
              <ul className="space-y-3">
                <li className="text-shop-muted text-sm">Toronto: +1 (416) 555-0147</li>
                <li className="text-shop-muted text-sm">Montreal: +1 (514) 555-0193</li>
                <li><a href="mailto:hello@thechairbarber.com" className="text-shop-muted text-sm hover:text-shop-gold transition-colors">hello@thechairbarber.com</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 gap-4">
            <p className="text-shop-muted text-xs">© 2026 The Chair Barbershop. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-shop-muted text-xs hover:text-shop-text transition-colors">Privacy</a>
              <a href="#" className="text-shop-muted text-xs hover:text-shop-text transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
