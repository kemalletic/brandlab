"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { KATEGORIJE } from "@/lib/products";
import { IconArrowRight, IconClose } from "./Icons";

const GLAVNI = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?novo=1", label: "Novo" },
  { href: "/o-nama", label: "O nama" },
];

export default function MobileMenu() {
  const { menuOpen, setMenuOpen } = useStore();
  if (!menuOpen) return null;
  return <MenuPanel onClose={() => setMenuOpen(false)} />;
}

function MenuPanel({ onClose }: { onClose: () => void }) {
  const { cart, wishlist, hydrated } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const cartCount = hydrated ? cart.reduce((s, i) => s + i.kolicina, 0) : 0;
  const wishCount = hydrated ? wishlist.length : 0;

  return (
    <div className="fade-in fixed inset-0 z-[85] flex flex-col overflow-y-auto bg-ink text-white lg:hidden">
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <Link href="/" onClick={onClose} className="h-display text-lg">
          BRANDLAB<span className="align-super text-[0.5em]">®</span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zatvori meni"
          className="-mr-2.5 flex h-11 w-11 items-center justify-center"
        >
          <IconClose />
        </button>
      </div>

      <nav className="flex flex-col px-4 pt-6">
        {GLAVNI.map((l, i) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={onClose}
            style={{ animationDelay: `${i * 55}ms` }}
            className="menu-item-rise h-display flex items-center justify-between border-b border-white/10 py-4 text-[2.75rem] leading-none"
          >
            {l.label}
            <IconArrowRight className="h-6 w-6 text-white/30" />
          </Link>
        ))}
      </nav>

      <div className="px-4 pt-8">
        <p className="label-tech mb-3 text-white/40">Kolekcije</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {KATEGORIJE.map((k, i) => (
            <Link
              key={k.slug}
              href={`/shop?kategorija=${k.slug}`}
              onClick={onClose}
              style={{ animationDelay: `${180 + i * 35}ms` }}
              className="menu-item-rise border-b border-white/10 py-2.5 text-sm font-medium text-white/85"
            >
              {k.naziv}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto px-4 pb-8 pt-10">
        <div className="mb-5 grid grid-cols-2 gap-3">
          <Link
            href="/favoriti"
            onClick={onClose}
            className="flex items-center justify-between border border-white/25 px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.1em]"
          >
            Favoriti
            {wishCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cobalt px-1.5 text-[10px] leading-none">
                {wishCount}
              </span>
            )}
          </Link>
          <Link
            href="/korpa"
            onClick={onClose}
            className="flex items-center justify-between border border-white/25 px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.1em]"
          >
            Korpa
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cobalt px-1.5 text-[10px] leading-none">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link href="/prijava" onClick={onClose} className="btn btn-primary w-full">
            Prijavi se
          </Link>
          <Link
            href="/registracija"
            onClick={onClose}
            className="btn btn-ghost-light w-full"
          >
            Otvori račun
          </Link>
        </div>

        <p className="label-tech mt-8 text-white/30">
          Besplatna dostava iznad 100 KM
        </p>
      </div>
    </div>
  );
}
