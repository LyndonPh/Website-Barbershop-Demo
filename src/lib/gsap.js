import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

export { gsap, ScrollTrigger };
