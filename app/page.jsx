import { listProducts, getSettings } from "../lib/db.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../components/Hero.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import WhySection from "../components/WhySection.jsx";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const products = listProducts({ activeOnly: true });
  const settings = getSettings();

  return (
    <>
      <Header />
      <main>
        <Hero site={settings.site} />
        <ProductGrid products={products} />
        <WhySection />
      </main>
      <Footer site={settings.site} />
    </>
  );
}
