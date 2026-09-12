"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

export default function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, updateQty, removeItem, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-bg2 border-l border-line z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-line shrink-0">
              <h3 className="font-extrabold text-white flex items-center gap-2">
                <ShoppingBag size={18} /> Кошик
              </h3>
              <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {items.length === 0 ? (
                <p className="text-cream/50 text-sm text-center mt-10">Кошик порожній</p>
              ) : (
                items.map((it) => (
                  <div key={it.productId} className="flex gap-3 card p-3">
                    <div className="w-16 h-16 rounded-lg bg-bg3 overflow-hidden shrink-0">
                      {it.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{it.name}</div>
                      <div className="text-sm text-orange2 font-bold mt-0.5">{money(it.price)}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(it.productId, it.qty - 1)}
                          className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm text-white w-5 text-center">{it.qty}</span>
                        <button
                          onClick={() => updateQty(it.productId, it.qty + 1)}
                          className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(it.productId)}
                          className="ml-auto text-cream/40 hover:text-bad"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-line shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-cream/70 text-sm">Разом</span>
                  <span className="text-xl font-extrabold text-white">{money(totalPrice)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="btn-primary w-full py-3.5 flex items-center justify-center"
                >
                  Оформити замовлення
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
