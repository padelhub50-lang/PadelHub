"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const BRANDS = ["Bullpadel", "Head", "Babolat", "Adidas", "Asics", "Wilson", "Nox", "Siux"];

export default function BrandMarquee() {
  const trackRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      // Track renders the brand list twice back-to-back; looping exactly
      // half its width makes the seam invisible.
      const loop = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 22,
        repeat: -1,
      });
      return () => loop.kill();
    });
    return () => mm.revert();
  }, { scope: trackRef });

  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="border-y border-line bg-bg2/60 overflow-hidden py-5">
      <div ref={trackRef} className="flex w-max gap-14 will-change-transform">
        {items.map((b, i) => (
          <span key={i} className="text-cream/35 font-extrabold text-lg md:text-xl tracking-wide uppercase shrink-0">
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
