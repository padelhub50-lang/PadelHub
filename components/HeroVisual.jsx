"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Second hero animation: slow morphing aurora blobs, a sweeping light beam
// and gently pulsing bokeh dots — a calmer layered look, replacing the
// earlier orbit-ring / particle-rise system.
const BOKEH = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  top: 10 + ((i * 53) % 80),
  left: 6 + ((i * 31) % 88),
  size: 4 + (i % 4) * 3,
  delay: (i % 5) * 0.5,
  dur: 2.6 + (i % 4) * 0.4,
}));

export default function HeroVisual() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-blob='a']", {
          x: 60,
          y: -40,
          scale: 1.15,
          borderRadius: "42% 58% 65% 35% / 45% 40% 60% 55%",
          duration: 9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to("[data-blob='b']", {
          x: -50,
          y: 30,
          scale: 0.9,
          borderRadius: "60% 40% 35% 65% / 55% 65% 35% 45%",
          duration: 11,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to("[data-blob='c']", {
          x: 30,
          y: 50,
          scale: 1.1,
          borderRadius: "50% 50% 40% 60% / 60% 45% 55% 40%",
          duration: 7.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        gsap.to("[data-sweep]", {
          xPercent: 260,
          duration: 4.5,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 2.4,
        });

        gsap.utils.toArray("[data-bokeh]").forEach((el, i) => {
          gsap.to(el, {
            opacity: 0.9,
            scale: 1.5,
            duration: BOKEH[i].dur,
            delay: BOKEH[i].delay,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative w-full h-full overflow-hidden">
      {/* morphing gradient blobs */}
      <div
        data-blob="a"
        className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-orange/50 to-rust/40 blur-3xl"
      />
      <div
        data-blob="b"
        className="absolute bottom-0 right-1/4 w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-gold/45 to-orange2/35 blur-3xl"
      />
      <div
        data-blob="c"
        className="absolute top-1/3 right-1/5 w-52 h-52 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-orange2/40 to-gold/30 blur-2xl"
      />

      {/* diagonal light sweep */}
      <div
        data-sweep
        className="absolute -left-1/2 top-0 h-full w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* pulsing bokeh dots */}
      {BOKEH.map((b) => (
        <span
          key={b.id}
          data-bokeh
          className="absolute rounded-full bg-gold/70 opacity-40"
          style={{ top: `${b.top}%`, left: `${b.left}%`, width: b.size, height: b.size }}
        />
      ))}
    </div>
  );
}
