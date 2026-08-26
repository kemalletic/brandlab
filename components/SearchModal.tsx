"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PROIZVODI, nazivKategorije } from "@/lib/products";
import { cijenaKM, normalizuj } from "@/lib/format";
import { IconClose, IconSearch } from "./Icons";

export default function SearchModal() {
  const { searchOpen } = useStore();
  // Sadržaj se montira tek kad se pretraga otvori, pa upisani tekst nestaje
  // sam od sebe pri zatvaranju — bez čišćenja stanja u efektu.
  if (!searchOpen) return null;
  return <SearchPanel />;
}

function SearchPanel() {
  const { setSearchOpen } = useStore();
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [setSearchOpen]);

  const rezultati = useMemo(() => {
    const query = normalizuj(q.trim());
    if (!query) return [];
    return PROIZVODI.filter((p) => {
      const haystack = normalizuj(`${p.naziv} ${nazivKategorije(p.kategorija)}`);
      return haystack.includes(query);
    }).slice(0, 6);
  }, [q]);

  return (
    <div className="fade-in fixed inset-0 z-[95] flex flex-col bg-white">
      <div className="border-b border-line px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <IconSearch className="h-6 w-6 shrink-0 text-steel" />
          <input
            type="search"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pretraži proizvode…"
            className="h-display-narrow w-full bg-transparent text-2xl outline-none placeholder:text-line sm:text-3xl"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Zatvori pretragu"
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-steel hover:text-ink"
          >
            <IconClose />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-5 py-8 sm:px-8">
        {q.trim() === "" && (
          <p className="label-tech">Ukucaj naziv proizvoda ili kategoriju</p>
        )}
        {q.trim() !== "" && rezultati.length === 0 && (
          <p className="text-steel">Nema rezultata za &ldquo;{q}&rdquo;.</p>
        )}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          {rezultati.map((p) => (
            <Link
              key={p.slug}
              href={`/proizvod/${p.slug}`}
              onClick={() => setSearchOpen(false)}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-smoke">
                <Image
                  src={p.slike[0]}
                  alt={p.naziv}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-sm font-semibold group-hover:text-cobalt">
                {p.naziv}
              </p>
              <p className="text-sm text-steel">{cijenaKM(p.cijena)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
