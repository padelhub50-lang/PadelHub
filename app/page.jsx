import { listProducts, getSettings } from "../lib/db.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../components/Hero.jsx";
import StatementSection from "../components/StatementSection.jsx";
import BrandMarquee from "../components/BrandMarquee.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import WhySection from "../components/WhySection.jsx";
import RacketQuiz from "../components/RacketQuiz.jsx";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const products = listProducts({ activeOnly: true });
  const settings = getSettings();

  return (
    <>
      <Header />
      <main>
        <Hero site={settings.site} />
        <BrandMarquee />
        <ProductGrid products={products} />
        <StatementSection />
        <WhySection />
        <RacketQuiz products={products} />
      </main>
      <Footer site={settings.site} />
    </>
  );
}
