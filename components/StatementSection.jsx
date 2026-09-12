"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 1, suffix: " день", label: "до відправки замовлення" },
  { value: 50, suffix: "+", label: "брендів та моделей у каталозі" },
  { value: 1000, suffix: "+", label: "гравців обрали Padel Hub" },
];

export default function StatementSection() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=90%",
            scrub: 1,
            pin: true,
          },
        })
          .from(root.current.querySelector("[data-statement-text]"), { opacity: 0, y: 40, scale: 0.96 })
          .from(root.current.querySelectorAll("[data-stat]"), { opacity: 0, y: 24, stagger: 0.12 }, "-=0.2");

        root.current.querySelectorAll("[data-stat-value]").forEach((el) => {
          const target = Number(el.dataset.statValue);
          const counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
            onUpdate: () => {
              el.textContent = Math.round(counter.val).toLocaleString("uk-UA");
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative min-h-screen flex items-center justify-center px-5 md:px-7 py-24 bg-gradient-to-b from-[#0A0806] via-[#1F1710] to-[#0A0806] text-center"
    >
      <div className="max-w-4xl">
        <p data-statement-text className="text-2xl md:text-4xl font-extrabold text-white leading-snug">
          Кожен удар — це результат правильного спорядження.
          <br />
          <span className="text-orange2">Padel Hub</span> підбирає його за вас.
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STATS.map((s) => (
            <div key={s.label} data-stat className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-extrabold text-white tabular-nums">
                <span data-stat-value={s.value}>0</span>
                {s.suffix}
              </div>
              <p className="mt-2 text-sm text-cream/60 max-w-[180px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
