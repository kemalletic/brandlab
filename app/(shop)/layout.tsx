import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import Toaster from "@/components/Toaster";
import Ticker from "@/components/Ticker";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
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
  );
}
