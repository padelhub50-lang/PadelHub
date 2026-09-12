"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShoppingBag, ImageOff } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import RacketStatBars from "./RacketStatBars.jsx";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

const TAG_STYLES = {
  Хіт: "bg-orange/18 text-orange2",
  Новинка: "bg-good/16 text-good",
  Знижка: "bg-bad/18 text-bad",
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const cover = product.images?.[0];
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      const img = imgRef.current;
      if (!card) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const liftY = gsap.quickTo(card, "y", { duration: 0.25, ease: "power2.out" });
        const liftShadow = gsap.quickTo(card, "boxShadow", { duration: 0.25, ease: "power2.out" });
        const scaleImg = img ? gsap.quickTo(img, "scale", { duration: 0.4, ease: "power2.out" }) : null;

        const onEnter = () => {
          liftY(-6);
          liftShadow("0 20px 40px rgba(0,0,0,0.35)");
          scaleImg?.(1.08);
        };
        const onLeave = () => {
          liftY(0);
          liftShadow("0 0px 0px rgba(0,0,0,0)");
          scaleImg?.(1);
        };
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        return () => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope: cardRef }
  );

  return (
    <div ref={cardRef} className="card p-4 flex flex-col will-change-transform">
      <Link
        href={`/product/${product.id}`}
        className="block relative rounded-xl overflow-hidden h-40 mb-4 bg-gradient-to-br from-bg3 to-bg2"
      >
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
          <img ref={imgRef} src={cover} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cream/30">
            <ImageOff size={28} />
          </div>
        )}
      </Link>

      <div className="text-xs text-cream/50 font-semibold uppercase tracking-wide mb-1">{product.category}</div>
      <Link
        href={`/product/${product.id}`}
        className="font-bold text-white leading-snug mb-2 hover:text-orange2 transition-colors"
      >
        {product.name}
      </Link>

      <RacketStatBars stats={product.stats} compact />

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
    </div>
  );
}
