"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { totalCount, setDrawerOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/#catalog", label: "Каталог" },
    { href: "/#why", label: "Чому ми" },
    { href: "/#contacts", label: "Контакти" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#14110e]/92 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-5 md:px-7 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange to-rust flex items-center justify-center font-extrabold text-white">
            P
          </span>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Padel<span className="text-orange2">Hub</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative px-4 py-2 text-sm font-semibold text-cream hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative w-10 h-10 rounded-xl bg-white/5 border border-line flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-orange hover:to-rust transition-all"
            aria-label="Кошик"
          >
            <ShoppingBag size={18} />
            {totalCount > 0 && (
              <motion.span
                key={totalCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-gold text-[#221B15] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {totalCount}
              </motion.span>
            )}
          </button>
          <button
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-line flex items-center justify-center text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Меню"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-[#14110e] px-5 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="px-2 py-2.5 text-sm font-semibold text-cream hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
