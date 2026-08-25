import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import Toaster from "@/components/Toaster";
import Ticker from "@/components/Ticker";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "BRANDLAB — Muška ulična odjeća",
    template: "%s — BRANDLAB",
  },
  description:
    "BRANDLAB — moderni muški streetwear. Duksevi, majice, jakne i pantalone dizajnirane za grad. Besplatna dostava iznad 100 KM.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bs"
      className={`${archivo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Ticker />
          <Header />
          <MobileMenu />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchModal />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
