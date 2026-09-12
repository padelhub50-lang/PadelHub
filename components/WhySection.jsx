"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Truck, ShieldCheck, Star, Wallet } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { icon: Truck, title: "Швидка доставка", text: "Відправляємо замовлення протягом 1 дня Новою поштою по всій Україні." },
  { icon: ShieldCheck, title: "Тільки оригінал", text: "Працюємо напряму з брендами — жодних підробок чи сірого імпорту." },
  { icon: Star, title: "Перевірений вибір", text: "У каталозі — тільки спорядження, перевірене нашими інструкторами та гравцями." },
  { icon: Wallet, title: "Зручна оплата", text: "Оплата карткою онлайн або при отриманні — обирайте, як зручно." },
];

export default function WhySection() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.current.querySelectorAll("[data-why-card]"), {
          opacity: 0,
          y: 24,
          duration: 0.45,
          stagger: { each: 0.08, from: "start", grid: "auto" },
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        root.current.querySelectorAll("[data-why-card]").forEach((card) => {
          const y = gsap.quickTo(card, "y", { duration: 0.3, ease: "power2.out" });
          const onEnter = () => y(-4);
          const onLeave = () => y(0);
          card.addEventListener("pointerenter", onEnter);
          card.addEventListener("pointerleave", onLeave);
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="why" ref={root} className="max-w-7xl mx-auto px-5 md:px-7 py-16">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">Чому обирають Padel Hub</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ITEMS.map((it) => (
          <div
            key={it.title}
            data-why-card
            className="p-6 rounded-2xl bg-bg3 hover:bg-orange/10 transition-colors flex flex-col gap-3 will-change-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange to-rust flex items-center justify-center text-white">
              <it.icon size={20} />
            </div>
            <h3 className="font-bold text-white">{it.title}</h3>
            <p className="text-sm text-cream/60 leading-relaxed">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
