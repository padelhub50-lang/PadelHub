import "./globals.css";
import { CartProvider } from "../context/CartContext.jsx";
import CartDrawer from "../components/CartDrawer.jsx";

export const metadata = {
  title: "Padel Hub — спорядження для падел-тенісу",
  description:
    "Ракетки, м'ячі, взуття, одяг та аксесуари для падел-тенісу. Доставка по всій Україні Новою поштою.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
