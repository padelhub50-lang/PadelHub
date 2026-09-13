import { notFound } from "next/navigation";
import { getProduct, getSettings } from "../../../lib/db.js";
import Header from "../../../components/Header.jsx";
import Footer from "../../../components/Footer.jsx";
import Gallery from "../../../components/Gallery.jsx";
import ProductInfo from "../../../components/ProductInfo.jsx";

export const dynamic = "force-dynamic";

export default function ProductPage({ params }) {
  const product = getProduct(params.id);
  if (!product || !product.active) notFound();
  const settings = getSettings();

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-5 md:px-7 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Gallery images={product.images} alt={product.name} />
          <ProductInfo product={product} />
        </div>
      </main>
      <Footer site={settings.site} />
    </>
  );
}
