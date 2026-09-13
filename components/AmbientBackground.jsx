"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// A quiet, drifting backdrop for content-heavy sections (catalog, product
// page) — subtler than the hero's animation so it never fights with
// product cards or text for attention.
export default function AmbientBackground() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-ambient='a']", { x: 70, y: -40, scale: 1.15, duration: 15, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to("[data-ambient='b']", { x: -60, y: 50, scale: 0.9, duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to("[data-ambient='c']", { x: 45, y: 35, scale: 1.1, duration: 13, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,90,31,0.14),transparent_65%)]" />
      <div data-ambient="a" className="absolute top-[4%] left-[2%] w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-orange/25 blur-3xl" />
      <div data-ambient="b" className="absolute bottom-[0%] right-[0%] w-96 h-96 md:w-[32rem] md:h-[32rem] rounded-full bg-gold/20 blur-3xl" />
      <div data-ambient="c" className="absolute top-[38%] right-[18%] w-64 h-64 md:w-80 md:h-80 rounded-full bg-rust/20 blur-3xl" />
    </div>
  );
}
