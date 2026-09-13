"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ProductCard from "./ProductCard.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { translateCategory } from "../lib/i18n.js";

const ALL = "__all__";

export default function ProductGrid({ products }) {
  const { t, lang } = useLang();
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return [ALL, ...Array.from(set)];
  }, [products]);

  const [active, setActive] = useState(ALL);
  const gridRef = useRef(null);

  const filtered = active === ALL ? products : products.filter((p) => p.category === active);

  // Grid-aware "wave" reveal — replays on every category switch so filtering
  // itself reads as a deliberate action, not just a re-render.
  useGSAP(
    () => {
      if (!gridRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(gridRef.current.querySelectorAll("[data-grid-item]"), {
          opacity: 0,
          scale: 0.92,
          y: 16,
          duration: 0.4,
          stagger: { each: 0.06, from: "start", grid: "auto" },
          ease: "back.out(1.4)",
        });
      });
      return () => mm.revert();
    },
    { scope: gridRef, dependencies: [active, filtered.length] }
  );

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-5 md:px-7 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">{t("catalog.title")}</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`chip ${active === c ? "chip-active" : ""}`}
            >
              {c === ALL ? t("catalog.all") : translateCategory(c, lang)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-cream/50 text-center py-16">{t("catalog.empty")}</p>
      ) : (
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <div key={p.id} data-grid-item>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
