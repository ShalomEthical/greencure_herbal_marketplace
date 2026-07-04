import type { Metadata } from "next";
import { Inter, Lalezar } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lalezar = Lalezar({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "GreenCure | Botanical Excellence from Cameroon",
  description:
    "Ethically sourced herbal remedies and botanical wellness products from the heart of Cameroon's highland rainforests. Traditional medicine for the modern soul.",
  keywords: "herbal remedies, botanical, Cameroon, organic, wellness, natural health, FCFA",
  openGraph: {
    title: "GreenCure | Botanical Excellence",
    description: "Discover premium herbal remedies crafted from the highland forests of Cameroon.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lalezar.variable} font-sans bg-cream text-earth-900 antialiased`}
      >
        <SessionProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
