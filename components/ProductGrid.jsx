"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";
import ProductCard from "./ProductCard.jsx";
import AmbientBackground from "./AmbientBackground.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { translateCategory } from "../lib/i18n.js";

const ALL = "__all__";
const ALL_BRANDS = "__all_brands__";

export default function ProductGrid({ products }) {
  const { t, lang } = useLang();
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return [ALL, ...Array.from(set)];
  }, [products]);

  const [active, setActive] = useState(ALL);
  const [activeBrand, setActiveBrand] = useState(ALL_BRANDS);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const gridRef = useRef(null);

  useEffect(() => {
    setActiveBrand(ALL_BRANDS);
  }, [active]);

  // Debounce so the grid only re-filters (and re-animates) a beat after
  // typing pauses, instead of re-running on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const brandsForCategory = useMemo(() => {
    if (active === ALL) return [];
    const set = new Set(products.filter((p) => p.category === active && p.brand).map((p) => p.brand));
    return Array.from(set).sort();
  }, [products, active]);

  const filtered = useMemo(() => {
    let list = active === ALL ? products : products.filter((p) => p.category === active);
    if (activeBrand !== ALL_BRANDS) list = list.filter((p) => p.brand === activeBrand);
    const q = debouncedSearch.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    return list;
  }, [products, active, activeBrand, debouncedSearch]);

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
    { scope: gridRef, dependencies: [active, activeBrand, debouncedSearch, filtered.length] }
  );

  return (
    <section id="catalog" className="relative overflow-hidden py-16">
      <AmbientBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{t("catalog.title")}</h2>
          <div className="relative w-full sm:w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("catalog.searchPlaceholder")}
              className="input pr-9 py-2.5 text-sm !bg-bg2 !text-white placeholder:!text-cream/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cream/40 hover:text-white"
                aria-label={t("common.close")}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className={`flex flex-wrap gap-2 ${brandsForCategory.length > 0 ? "mb-4" : "mb-8"}`}>
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

        {brandsForCategory.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveBrand(ALL_BRANDS)}
              className={`chip ${activeBrand === ALL_BRANDS ? "chip-active" : ""} !text-xs !py-1.5 !px-3.5`}
            >
              {t("catalog.allBrands")}
            </button>
            {brandsForCategory.map((b) => (
              <button
                key={b}
                onClick={() => setActiveBrand(b)}
                className={`chip ${activeBrand === b ? "chip-active" : ""} !text-xs !py-1.5 !px-3.5`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

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
      </div>
    </section>
  );
}
