"use client";

import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../../lib/gsap";

// Scroll px per second of footage
const PX_PER_SEC = 250;

export function BookingVideo() {
  const outerRef = useRef(null);   // tall wrapper that provides scroll distance
  const sectionRef = useRef(null); // sticky inner — stays in view
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);
  const [scrollPx, setScrollPx] = useState(1500);

  // Resize canvas at device pixel ratio for crisp output
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useGSAP(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const outer = outerRef.current;
    if (!video || !canvas || !outer) return;

    const ctx = canvas.getContext("2d");
    let isSeeking = false;
    let pendingTime = null;
    let tween = null;
    let st = null;

    const drawFrame = () => {
      const vw = canvas.width;
      const vh = canvas.height;
      const vAspect = video.videoWidth / video.videoHeight;
      const cAspect = vw / vh;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (vAspect > cAspect) {
        sw = vh * vAspect;
        sx = (vw - sw) / 2;
      } else {
        sh = vw / vAspect;
        sy = (vh - sh) / 2;
      }
      ctx.clearRect(0, 0, vw, vh);
      ctx.drawImage(video, sx, sy, sw, sh);
    };

    const seekTo = (time) => {
      const clamped = Math.max(0, Math.min(time, video.duration - 0.001));
      if (isSeeking) { pendingTime = clamped; return; }
      isSeeking = true;
      video.currentTime = clamped;
    };

    video.addEventListener("seeked", () => {
      drawFrame();
      isSeeking = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        seekTo(t);
      }
    });
    video.addEventListener("loadeddata", drawFrame, { once: true });

    const setup = () => {
      const dur = video.duration || 6;
      const px = Math.max(dur * PX_PER_SEC, 800);
      setScrollPx(px);

      // Give React one frame to apply new height before ScrollTrigger measures
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        const proxy = { t: 0 };
        tween = gsap.to(proxy, {
          t: dur,
          ease: "none",
          paused: true,
          onUpdate() { seekTo(proxy.t); },
        });

        // Trigger on the OUTER wrapper.
        // start "top bottom"  → first moment section is visible at bottom of viewport
        // end   "bottom bottom" → section bottom reaches viewport bottom (fully traversed)
        st = ScrollTrigger.create({
          trigger: outer,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.5,
          animation: tween,
          invalidateOnRefresh: true,
        });

        // Text reveal fires as soon as the section enters the viewport
        gsap.fromTo(
          textRef.current.children,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.12,
            ease: "cubic-bezier(0.22,0.61,0.36,1)",
            scrollTrigger: { trigger: outer, start: "top 80%", once: true },
          }
        );

        gsap.fromTo(
          btnRef.current,
          { y: 16, scale: 0.95, opacity: 0 },
          {
            y: 0, scale: 1, opacity: 1, duration: 0.55,
            ease: "back.out(1.5)", delay: 0.5,
            scrollTrigger: { trigger: outer, start: "top 80%", once: true },
          }
        );
      });
    };

    video.pause();
    video.currentTime = 0;

    if (video.readyState >= 1) setup();
    else video.addEventListener("loadedmetadata", setup, { once: true });

    return () => { tween?.kill(); st?.kill(); };
  }, { scope: outerRef });

  return (
    // Outer: tall enough to provide scroll travel for the full video
    <div
      ref={outerRef}
      style={{ height: `calc(100vh + ${scrollPx}px)` }}
    >
      {/* Sticky inner: stays in view as outer scrolls */}
      <section
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        {/* Hidden video — frame source only */}
        <video
          ref={videoRef}
          src="/barbershop-booking.mp4"
          muted
          playsInline
          preload="auto"
          style={{ display: "none" }}
        />

        {/* Canvas — crisp DPR-scaled frame output */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%", display: "block" }}
        />

        {/* Gradient: dark left → transparent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-shop-bg via-shop-bg/80 to-transparent pointer-events-none" />
        {/* Top/bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-shop-bg/50 via-transparent to-shop-bg/60 pointer-events-none" />

        {/* Text — left side */}
        <div className="relative z-10 h-full flex items-center justify-start px-6 md:px-[5%]">
          <div ref={textRef} className="max-w-md">
            <span className="eyebrow opacity-0">Book Your Chair</span>
            <span className="gold-rule mt-3 opacity-0" />
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-shop-text leading-tight mb-6 opacity-0">
              Ready when<br />you are.
            </h2>
            <p className="text-shop-muted text-sm md:text-base leading-relaxed mb-4 opacity-0">
              Same-day slots available at both locations. Pick your barber,
              pick your time — done in 30 seconds.
            </p>
            <ul className="space-y-2 mb-10 opacity-0">
              {["No sign-up required", "Choose your barber directly", "Instant confirmation, no wait"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-shop-muted">
                  <span className="text-shop-gold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div ref={btnRef} className="opacity-0">
              <Link
                to="/book"
                className="inline-block bg-shop-gold text-shop-bg px-10 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-shop-gold-light transition-all duration-200"
              >
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
