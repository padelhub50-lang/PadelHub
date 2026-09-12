"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRight, Truck } from "lucide-react";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Hero({ site }) {
  const root = useRef(null);
  const ctaRef = useRef(null);
  const blobRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        const split = new SplitText(root.current.querySelector("[data-hero-title]"), {
          type: "chars,words",
        });

        tl.from(root.current.querySelector("[data-hero-badge]"), { opacity: 0, y: 14, duration: 0.5 })
          .from(
            split.chars,
            { opacity: 0, y: 24, rotateX: -40, duration: 0.6, stagger: 0.015, ease: "expo.out" },
            "-=0.2"
          )
          .from(
            root.current.querySelector("[data-hero-subtitle]"),
            { opacity: 0, y: 16, duration: 0.5 },
            "-=0.35"
          )
          .from(
            root.current.querySelectorAll("[data-hero-cta] > *"),
            { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 },
            "-=0.3"
          );

        // Slow ambient parallax drift on the glow blob — decorative layer only.
        gsap.to(blobRef.current, {
          yPercent: 12,
          xPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        // Magnetic pull on the primary CTA.
        const cta = ctaRef.current;
        if (cta) {
          const xTo = gsap.quickTo(cta, "x", { duration: 0.4, ease: "power3" });
          const yTo = gsap.quickTo(cta, "y", { duration: 0.4, ease: "power3" });
          const onMove = (e) => {
            const r = cta.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.25);
            yTo((e.clientY - r.top - r.height / 2) * 0.25);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };
          cta.addEventListener("pointermove", onMove);
          cta.addEventListener("pointerleave", onLeave);
          return () => {
            cta.removeEventListener("pointermove", onMove);
            cta.removeEventListener("pointerleave", onLeave);
          };
        }

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative px-5 md:px-7 pt-16 md:pt-24 pb-20 overflow-hidden bg-gradient-to-br from-[#181310] via-[#221208] to-[#3A1305]"
    >
      <div
        ref={blobRef}
        className="pointer-events-none absolute -top-20 right-[-10%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,138,61,0.16),transparent_70%)]"
      />
      <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
        <div
          data-hero-badge
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-gold/10 border border-gold/25 text-gold px-4 py-1.5 rounded-full mb-6"
        >
          <Sparkles size={14} /> Офіційний екіпірувальник падел-гравців
        </div>

        <h1
          data-hero-title
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl [perspective:600px]"
        >
          {site?.heroTitle}
        </h1>

        <p data-hero-subtitle className="mt-5 text-cream/70 text-base md:text-lg max-w-xl">
          {site?.heroSubtitle}
        </p>

        <div data-hero-cta className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            ref={ctaRef}
            href="#catalog"
            className="btn-primary px-7 py-3.5 inline-flex items-center gap-2 will-change-transform"
          >
            Обрати спорядження <ArrowRight size={17} />
          </a>
          <span className="inline-flex items-center gap-2 text-sm text-cream/60 px-4 py-3.5">
            <Truck size={16} /> Доставка по всій Україні
          </span>
        </div>
      </div>
    </section>
  );
}
