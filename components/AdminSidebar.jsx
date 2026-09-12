"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Boxes, ClipboardList, SlidersHorizontal, LogOut, Globe } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Огляд", icon: LayoutGrid },
  { href: "/admin/products", label: "Товари", icon: Boxes },
  { href: "/admin/orders", label: "Замовлення", icon: ClipboardList },
  { href: "/admin/settings", label: "Налаштування", icon: SlidersHorizontal },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 shrink-0 bg-bg2 border-r border-line min-h-screen flex flex-col p-4">
      <div className="flex items-center gap-2.5 px-2 py-3 mb-4">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange to-rust flex items-center justify-center font-extrabold text-white">
          P
        </span>
        <span className="font-extrabold text-white">Padel Hub</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active ? "bg-gradient-to-br from-orange to-rust text-white" : "text-cream/70 hover:bg-white/5"
              }`}
            >
              <l.icon size={17} /> {l.label}
            </Link>
          );
        })}
      </nav>

      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-cream/60 hover:bg-white/5 mb-1"
      >
        <Globe size={17} /> Переглянути сайт
      </a>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-bad hover:bg-bad/10"
      >
        <LogOut size={17} /> Вийти
      </button>
    </aside>
  );
}
