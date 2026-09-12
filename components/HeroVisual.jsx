"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Abstract animated centerpiece for the hero — several distinct motion
// types layered together (float, pulse, orbit, particle drift) instead of
// a single literal object, so it reads as energetic without needing to be
// a pixel-accurate model of anything.
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: 8 + ((i * 37) % 84),
  delay: (i % 7) * 0.6,
  duration: 5 + (i % 5),
  size: 3 + (i % 3) * 2,
}));

export default function HeroVisual() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-orb='a']", { y: -22, x: 10, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to("[data-orb='b']", { y: 18, x: -14, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to("[data-orb='c']", { y: -14, x: -8, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

        gsap.to("[data-ring]", { rotate: 360, duration: 26, ease: "none", repeat: -1 });
        gsap.to("[data-ring-dot]", { rotate: -360, duration: 10, ease: "none", repeat: -1, transformOrigin: "0 90px" });

        gsap.to("[data-pulse]", { scale: 1.12, opacity: 0.55, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

        gsap.utils.toArray("[data-particle]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: -220,
              opacity: 1,
              duration: PARTICLES[i].duration,
              delay: PARTICLES[i].delay,
              ease: "power1.out",
              repeat: -1,
              repeatDelay: 0.4,
              onRepeat: () => gsap.set(el, { opacity: 0 }),
            }
          );
          gsap.to(el, {
            opacity: 0,
            duration: 1,
            delay: PARTICLES[i].delay + PARTICLES[i].duration * 0.7,
            repeat: -1,
            repeatDelay: PARTICLES[i].duration - 1 + 0.4,
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* pulsing glow core */}
      <div
        data-pulse
        className="absolute w-52 h-52 md:w-64 md:h-64 rounded-full bg-[radial-gradient(circle,rgba(255,138,61,0.45),transparent_70%)] blur-xl"
      />

      {/* rotating dashed orbit ring */}
      <svg data-ring className="absolute w-72 h-72 md:w-96 md:h-96" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="#FF8A3D" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 10" />
      </svg>
      <div data-ring-dot className="absolute w-3.5 h-3.5 rounded-full bg-gold shadow-[0_0_16px_4px_rgba(255,184,77,0.6)]" />

      {/* floating gradient orbs */}
      <div
        data-orb="a"
        className="absolute top-1/4 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-orange to-rust opacity-80 blur-[2px]"
      />
      <div
        data-orb="b"
        className="absolute bottom-1/4 right-1/3 w-16 h-16 rounded-full bg-gradient-to-br from-gold to-orange2 opacity-70 blur-[1px]"
      />
      <div
        data-orb="c"
        className="absolute top-1/2 right-1/4 w-9 h-9 rounded-full bg-white/80 blur-[1px]"
      />

      {/* drifting particles */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          data-particle
          className="absolute bottom-6 rounded-full bg-gold/80"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}
