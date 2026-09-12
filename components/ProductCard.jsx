"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ImageOff } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

const TAG_STYLES = {
  Хіт: "bg-orange/18 text-orange2",
  Новинка: "bg-good/16 text-good",
  Знижка: "bg-bad/18 text-bad",
};

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const cover = product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05 }}
      whileHover={{ y: -6 }}
      className="card p-4 flex flex-col group"
    >
      <Link href={`/product/${product.id}`} className="block relative rounded-xl overflow-hidden h-40 mb-4 bg-gradient-to-br from-bg3 to-bg2">
        {product.tag && (
          <span
            className={`absolute top-2 left-2 z-10 text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${
              TAG_STYLES[product.tag] || "bg-white/10 text-white"
            }`}
          >
            {product.tag}
          </span>
        )}
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cream/30">
            <ImageOff size={28} />
          </div>
        )}
      </Link>

      <div className="text-xs text-cream/50 font-semibold uppercase tracking-wide mb-1">{product.category}</div>
      <Link href={`/product/${product.id}`} className="font-bold text-white leading-snug mb-2 hover:text-orange2 transition-colors">
        {product.name}
      </Link>

      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-white">{money(product.price)}</span>
          {product.oldPrice ? (
            <span className="text-sm text-cream/40 line-through">{money(product.oldPrice)}</span>
          ) : null}
        </div>
        <button
          onClick={() => addItem(product, 1)}
          disabled={product.stock <= 0}
          className="btn-primary w-10 h-10 flex items-center justify-center disabled:from-transparent disabled:to-transparent disabled:bg-white/10"
          aria-label="Додати в кошик"
        >
          <ShoppingBag size={16} />
        </button>
      </div>
      {product.stock <= 0 && <div className="text-xs text-bad mt-2 font-semibold">Немає в наявності</div>}
    </motion.div>
  );
}
