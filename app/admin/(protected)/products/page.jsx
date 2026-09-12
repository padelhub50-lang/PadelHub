"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm("Видалити товар?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  const toggleActive = async (p) => {
    await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, active: !p.active }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-white">Товари</h1>
        <Link href="/admin/products/new" className="btn-primary px-4 py-2.5 flex items-center gap-2 text-sm">
          <Plus size={16} /> Додати товар
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-cream/50 border-b border-line">
              <th className="p-4 font-semibold">Товар</th>
              <th className="p-4 font-semibold">Категорія</th>
              <th className="p-4 font-semibold">Ціна</th>
              <th className="p-4 font-semibold">Залишок</th>
              <th className="p-4 font-semibold">Активний</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-bg3 overflow-hidden flex items-center justify-center shrink-0">
                      {p.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageOff size={14} className="text-cream/30" />
                      )}
                    </div>
                    <span className="text-white font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-cream/70">{p.category}</td>
                <td className="p-4 text-white font-semibold">{money(p.price)}</td>
                <td className="p-4 text-cream/70">{p.stock}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.active ? "bg-good/15 text-good" : "bg-white/10 text-cream/50"
                    }`}
                  >
                    {p.active ? "Активний" : "Прихований"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/products/${p.id}`} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-bad hover:bg-bad/10">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && products.length === 0 && <p className="text-cream/40 text-sm p-6 text-center">Товарів ще немає.</p>}
      </div>
    </div>
  );
}
