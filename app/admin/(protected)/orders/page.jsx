"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

const STATUS_STYLE = {
  pending: "bg-gold/15 text-gold",
  confirmed: "bg-good/15 text-good",
  paid: "bg-good/15 text-good",
  shipped: "bg-orange/15 text-orange2",
  cancelled: "bg-bad/15 text-bad",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then((d) => setOrders(d.orders || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white mb-6">Замовлення</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-cream/50 border-b border-line">
              <th className="p-4 font-semibold">Замовлення</th>
              <th className="p-4 font-semibold">Клієнт</th>
              <th className="p-4 font-semibold">Сума</th>
              <th className="p-4 font-semibold">Оплата</th>
              <th className="p-4 font-semibold">Статус</th>
              <th className="p-4 font-semibold">Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="p-4">
                  <Link href={`/admin/orders/${o.id}`} className="text-white font-semibold hover:text-orange2">
                    #{o.id}
                  </Link>
                </td>
                <td className="p-4 text-cream/70">
                  {o.customer?.name}
                  <div className="text-xs text-cream/40">{o.customer?.phone}</div>
                </td>
                <td className="p-4 text-white font-semibold">{money(o.total)}</td>
                <td className="p-4 text-cream/70">{o.paymentProvider || "-"}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[o.status] || "bg-white/10 text-cream/60"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-cream/50 text-xs">{new Date(o.createdAt).toLocaleString("uk-UA")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-cream/40 text-sm p-6 text-center">Замовлень поки немає.</p>}
      </div>
    </div>
  );
}
