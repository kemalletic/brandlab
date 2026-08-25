"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?kategorija=duksevi", label: "Novo" },
  { href: "/o-nama", label: "O nama" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const {
    cart,
    wishlist,
    setCartOpen,
    setSearchOpen,
    setMenuOpen,
    hydrated,
  } = useStore();

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;
  const cartCount = hydrated
    ? cart.reduce((sum, i) => sum + i.kolicina, 0)
    : 0;
  const wishCount = hydrated ? wishlist.length : 0;

  return (
    <header
      className={`sticky top-0 z-[80] transition-colors duration-300 ${
        transparent
          ? "bg-transparent text-white"
          : "border-b border-line bg-white text-ink"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Otvori meni"
            className="flex flex-col gap-[5px] lg:hidden"
          >
            <span className="block h-[1.5px] w-6 bg-current" />
            <span className="block h-[1.5px] w-6 bg-current" />
          </button>

          <Link href="/" className="h-display text-xl tracking-tight">
            BRANDLAB<span className="align-super text-[0.5em]">®</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="link-sweep text-xs font-semibold uppercase tracking-[0.1em]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Pretraga"
            className="text-lg"
          >
            ⌕
          </button>
          <Link href="/favoriti" aria-label="Favoriti" className="relative text-lg">
            ♡
            {wishCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-cobalt px-1 text-[10px] font-bold text-white">
                {wishCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label="Korpa"
            className="relative text-lg"
          >
            ⊙
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-cobalt px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
