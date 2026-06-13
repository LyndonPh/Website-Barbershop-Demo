"use client";

import { useMediaQuery } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Services", to: "/services" },
  { label: "Team", to: "/team" },
  { label: "Questions", to: "/questions" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");
  const { pathname } = useLocation();
  const toggle = () => setIsMobileMenuOpen((p) => !p);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 bg-shop-bg/95 backdrop-blur-sm border-b border-shop-border">
      <Link to="/" className="flex items-center gap-2">
        <span className="font-playfair text-lg font-700 tracking-tight text-shop-text">THE CHAIR</span>
        <span className="text-shop-gold text-xs">✦</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden lg:flex items-center gap-8">
        {NAV_LINKS.map(({ label, to }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`eyebrow transition-colors duration-200 relative pb-0.5 ${
                active ? "text-shop-text" : "text-shop-muted hover:text-shop-text"
              }`}
            >
              {label}
              {active && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-px bg-shop-gold"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <Link
          to="/book"
          className="inline-block border border-shop-gold text-shop-gold px-5 py-2 text-xs tracking-widest uppercase hover:bg-shop-gold hover:text-shop-bg transition-all duration-200"
        >
          Book Now
        </Link>
      </div>

      {/* Mobile toggle */}
      <button onClick={toggle} className="lg:hidden flex flex-col gap-1.5 p-2">
        <motion.span animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-6 h-px bg-shop-text" transition={{ duration: 0.2 }} />
        <motion.span animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-6 h-px bg-shop-text" transition={{ duration: 0.1 }} />
        <motion.span animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-6 h-px bg-shop-text" transition={{ duration: 0.2 }} />
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-shop-bg border-b border-shop-border px-6 py-8 flex flex-col gap-6 lg:hidden"
          >
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={toggle}
                className={`eyebrow transition-colors ${pathname === to ? "text-shop-gold" : "text-shop-muted hover:text-shop-text"}`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={toggle}
              className="inline-block border border-shop-gold text-shop-gold px-5 py-3 text-xs tracking-widest uppercase text-center hover:bg-shop-gold hover:text-shop-bg transition-all duration-200"
            >
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
