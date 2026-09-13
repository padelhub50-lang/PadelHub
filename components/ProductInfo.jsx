"use client";

import { useLang } from "../context/LanguageContext.jsx";
import { translateCategory } from "../lib/i18n.js";
import AddToCartPanel from "./AddToCartPanel.jsx";
import RacketStatBars from "./RacketStatBars.jsx";

export default function ProductInfo({ product }) {
  const { t, lang } = useLang();

  return (
    <div>
      <div className="text-xs text-cream/50 font-semibold uppercase tracking-wide mb-2">
        {translateCategory(product.category, lang)}
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-5">{product.name}</h1>
      <AddToCartPanel product={product} />
      {product.stats && Object.keys(product.stats).length > 0 && (
        <div className="mt-8 pt-8 border-t border-line">
          <h2 className="text-white font-bold mb-2">{t("product.gameStats")}</h2>
          <RacketStatBars stats={product.stats} />
        </div>
      )}
      {product.description && (
        <div className="mt-8 pt-8 border-t border-line">
          <h2 className="text-white font-bold mb-2">{t("product.description")}</h2>
          <p className="text-cream/70 leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>
      )}
    </div>
  );
}
