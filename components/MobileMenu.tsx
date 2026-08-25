"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { KATEGORIJE } from "@/lib/products";

const LINKOVI = [
  { href: "/shop", label: "Shop" },
  { href: "/o-nama", label: "O nama" },
];

export default function MobileMenu() {
  const { menuOpen, setMenuOpen } = useStore();

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (!menuOpen) return null;

  return (
    <div className="fade-in fixed inset-0 z-[85] flex flex-col bg-ink text-white lg:hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="h-display text-xl">BRANDLAB</span>
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Zatvori meni"
          className="text-3xl leading-none"
        >
          ✕
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-2 px-5">
        {LINKOVI.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="menu-item-rise h-display text-5xl leading-none"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/15 px-5 py-6">
        <p className="label-tech mb-3 text-white/40">Kolekcije</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {KATEGORIJE.map((k) => (
            <Link
              key={k.slug}
              href={`/shop?kategorija=${k.slug}`}
              onClick={() => setMenuOpen(false)}
              className="link-sweep text-sm font-medium"
            >
              {k.naziv}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
