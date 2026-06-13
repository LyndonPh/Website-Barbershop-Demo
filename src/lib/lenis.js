import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let lenis;

export function initLenis() {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.85,
  });

  // Drive Lenis through GSAP's ticker — this is the correct sync method.
  // It ensures ScrollTrigger always reads Lenis's scroll position, not native scroll.
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Keep ScrollTrigger in sync on every Lenis scroll event
  lenis.on("scroll", ScrollTrigger.update);

  return lenis;
}

export function getLenis() {
  return lenis;
}
