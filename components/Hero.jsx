"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { Sparkles, ArrowRight, Truck } from "lucide-react";
import HeroVisual from "./HeroVisual.jsx";
import { useLang } from "../context/LanguageContext.jsx";

gsap.registerPlugin(SplitText);

export default function Hero({ site }) {
  const root = useRef(null);
  const ctaRef = useRef(null);
  const { t, lang } = useLang();

  const heroTitle = (lang === "en" && site?.heroTitleEn) || site?.heroTitle;
  const heroSubtitle = (lang === "en" && site?.heroSubtitleEn) || site?.heroSubtitle;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = new SplitText(root.current.querySelector("[data-hero-title]"), {
          type: "chars,words",
        });

        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(root.current.querySelector("[data-hero-badge]"), { opacity: 0, y: 14, duration: 0.5 })
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
          )
          .from(root.current.querySelector("[data-hero-visual]"), { opacity: 0, scale: 0.9, duration: 0.8 }, "-=0.5");

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
      className="relative overflow-hidden bg-gradient-to-br from-[#181310] via-[#221208] to-[#3A1305] py-20 md:py-28"
    >
      {/* Animation sits full-bleed behind the copy, not beside it. */}
      <div data-hero-visual className="absolute inset-0 z-0">
        <HeroVisual />
      </div>
      {/* Dims the animation directly behind the text so it stays readable. */}
      <div className="absolute inset-0 z-[5] bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,rgba(10,8,6,0.6),transparent_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-7 text-center flex flex-col items-center">
        <div
          data-hero-badge
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-gold/10 border border-gold/25 text-gold px-4 py-1.5 rounded-full mb-6"
        >
          <Sparkles size={14} /> {t("hero.badge")}
        </div>

        <h1
          data-hero-title
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight [perspective:600px]"
        >
          {heroTitle}
        </h1>

        <p data-hero-subtitle className="mt-5 text-cream/70 text-base md:text-lg max-w-xl">
          {heroSubtitle}
        </p>

        <div data-hero-cta className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            ref={ctaRef}
            href="#catalog"
            className="btn-primary px-7 py-3.5 inline-flex items-center gap-2 will-change-transform"
          >
            {t("hero.cta")} <ArrowRight size={17} />
          </a>
          <span className="inline-flex items-center gap-2 text-sm text-cream/60 px-4 py-3.5">
            <Truck size={16} /> {t("hero.delivery")}
          </span>
        </div>
      </div>
    </section>
  );
}
