import Link from "next/link";
import { listProducts, listOrders } from "../../../lib/db.js";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const products = listProducts();
  const orders = listOrders();
  const revenue = orders.filter((o) => ["paid", "confirmed", "shipped"].includes(o.status)).reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Товарів у каталозі", value: products.length },
    { label: "Усього замовлень", value: orders.length },
    { label: "Очікують оплати", value: pending },
    { label: "Дохід", value: money(revenue) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white mb-6">Огляд</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-sm text-cream/50 mb-1">{s.label}</div>
            <div className="text-2xl font-extrabold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white">Останні замовлення</h2>
          <Link href="/admin/orders" className="text-sm text-orange2">Усі замовлення →</Link>
        </div>
        <div className="flex flex-col divide-y divide-line">
          {orders.slice(0, 6).map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between py-3 hover:text-orange2">
              <div>
                <div className="text-sm font-semibold text-white">#{o.id}</div>
                <div className="text-xs text-cream/50">{o.customer?.name} · {new Date(o.createdAt).toLocaleString("uk-UA")}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{money(o.total)}</div>
                <div className="text-xs text-cream/50">{o.status}</div>
              </div>
            </Link>
          ))}
          {orders.length === 0 && <p className="text-cream/40 text-sm py-4">Замовлень поки немає.</p>}
        </div>
      </div>
    </div>
  );
}
