"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { IconBag, IconHeart, IconSearch, IconUser } from "./Icons";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?novo=1", label: "Novo" },
  { href: "/o-nama", label: "O nama" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const { cart, wishlist, setCartOpen, setSearchOpen, setMenuOpen, hydrated } =
    useStore();

  useEffect(() => {
    // Van početne header je uvijek solidan, pa nema šta da se prati.
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;
  const cartCount = hydrated ? cart.reduce((s, i) => s + i.kolicina, 0) : 0;
  const wishCount = hydrated ? wishlist.length : 0;

  // 44px touch meta na dodir, bez pomjeranja vizuelnog rasporeda
  const iconBtn =
    "relative flex h-11 w-11 items-center justify-center -mx-0.5 sm:mx-0";

  return (
    <header
      className={`sticky top-0 z-[80] transition-colors duration-300 ${
        transparent
          ? "bg-transparent text-white"
          : "border-b border-line bg-white text-ink"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Otvori meni"
            className="-ml-2.5 flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span className="block h-[1.5px] w-[22px] bg-current" />
            <span className="block h-[1.5px] w-[22px] bg-current" />
            <span className="block h-[1.5px] w-[22px] bg-current" />
          </button>

          <Link
            href="/"
            className="h-display shrink-0 text-lg tracking-tight sm:text-xl"
          >
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

        <div className="flex items-center sm:gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Pretraga"
            className={iconBtn}
          >
            <IconSearch />
          </button>

          <Link
            href="/prijava"
            aria-label="Prijava"
            className={`${iconBtn} hidden sm:flex`}
          >
            <IconUser />
          </Link>

          <Link href="/favoriti" aria-label="Favoriti" className={iconBtn}>
            <IconHeart />
            {wishCount > 0 && (
              <span className="absolute right-[5px] top-[4px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-cobalt px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                {wishCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Korpa${cartCount > 0 ? ` — ${cartCount}` : ""}`}
            className={`${iconBtn} -mr-2.5 sm:mr-0`}
          >
            <IconBag />
            {cartCount > 0 && (
              <span className="absolute right-[3px] top-[4px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-cobalt px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
