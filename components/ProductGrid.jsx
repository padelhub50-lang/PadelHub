"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products }) {
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["Всі", ...Array.from(set)];
  }, [products]);

  const [active, setActive] = useState("Всі");

  const filtered = active === "Всі" ? products : products.filter((p) => p.category === active);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-5 md:px-7 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">Каталог</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`chip ${active === c ? "chip-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-cream/50 text-center py-16">Товарів у цій категорії поки немає.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
