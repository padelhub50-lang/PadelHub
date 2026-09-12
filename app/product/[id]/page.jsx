import { notFound } from "next/navigation";
import { getProduct, getSettings } from "../../../lib/db.js";
import Header from "../../../components/Header.jsx";
import Footer from "../../../components/Footer.jsx";
import Gallery from "../../../components/Gallery.jsx";
import AddToCartPanel from "../../../components/AddToCartPanel.jsx";

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
          <div>
            <div className="text-xs text-cream/50 font-semibold uppercase tracking-wide mb-2">{product.category}</div>
            <h1 className="text-3xl font-extrabold text-white mb-5">{product.name}</h1>
            <AddToCartPanel product={product} />
            {product.description && (
              <div className="mt-8 pt-8 border-t border-line">
                <h2 className="text-white font-bold mb-2">Опис</h2>
                <p className="text-cream/70 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer site={settings.site} />
    </>
  );
}
