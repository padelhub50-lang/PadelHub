import { notFound } from "next/navigation";
import { getOrder, getSettings } from "../../../lib/db.js";
import Header from "../../../components/Header.jsx";
import Footer from "../../../components/Footer.jsx";
import OrderStatus from "../../../components/OrderStatus.jsx";

export const dynamic = "force-dynamic";

export default function OrderStatusPage({ params, searchParams }) {
  const order = getOrder(params.id);
  if (!order) notFound();
  const settings = getSettings();

  return (
    <>
      <Header />
      <OrderStatus order={order} cancelled={!!searchParams?.cancelled} />
      <Footer site={settings.site} />
    </>
  );
}
