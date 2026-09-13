"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useLang } from "../context/LanguageContext.jsx";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

export default function AddToCartPanel({ product }) {
  const { addItem } = useCart();
  const { t } = useLang();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-3xl font-extrabold text-white">{money(product.price)}</span>
        {product.oldPrice ? (
          <span className="text-lg text-cream/40 line-through">{money(product.oldPrice)}</span>
        ) : null}
      </div>
      <p className={`text-sm font-semibold mb-6 ${product.stock > 0 ? "text-good" : "text-bad"}`}>
        {product.stock > 0 ? `${t("product.inStock")}: ${product.stock} ${t("product.pcs")}` : t("product.outOfStock")}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white/5 border border-line rounded-xl px-3 py-2">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-white">
            <Minus size={16} />
          </button>
          <span className="w-6 text-center text-white font-semibold">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="text-white">
            <Plus size={16} />
          </button>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2"
        >
          {added ? (
            <>
              <Check size={18} /> {t("product.added")}
            </>
          ) : (
            <>
              <ShoppingBag size={18} /> {t("product.addToCart")}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
