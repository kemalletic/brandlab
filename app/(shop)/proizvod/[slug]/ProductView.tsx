"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { nazivKategorije, srodniProizvodi } from "@/lib/products";
import { cijenaKM, popustPosto } from "@/lib/format";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { IconHeart, IconMinus, IconPlus } from "@/components/Icons";

const SEKCIJE = ["Opis", "Materijal i održavanje", "Dostava i povrat"] as const;

export default function ProductView({ proizvod }: { proizvod: Product }) {
  const { addToCart, toggleWishlist, isWishlisted, hydrated } = useStore();
  const [velicina, setVelicina] = useState<string | null>(null);
  const [greska, setGreska] = useState(false);
  const [aktivnaSlika, setAktivnaSlika] = useState(0);
  const [otvorena, setOtvorena] = useState<string | null>("Opis");

  const saved = hydrated && isWishlisted(proizvod.slug);
  const srodni = srodniProizvodi(proizvod);

  function dodaj() {
    if (!velicina) {
      setGreska(true);
      return;
    }
    addToCart(proizvod.slug, velicina);
  }

  function sadrzajSekcije(naslov: string) {
    if (naslov === "Opis") return proizvod.opis;
    if (naslov === "Materijal i održavanje")
      return `${proizvod.materijal}. ${proizvod.odrzavanje}`;
    return "Dostava u BiH za 48 sata. Besplatno iznad 100 KM, inače 7 KM. Povrat je moguć 30 dana od preuzimanja, uz priložen račun i neoštećenu etiketu.";
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 sm:py-12">
      <nav className="label-tech mb-6 flex flex-wrap gap-2">
        <Link href="/" className="hover:text-ink">
          Početna
        </Link>
        <span>/</span>
        <Link
          href={`/shop?kategorija=${proizvod.kategorija}`}
          className="hover:text-ink"
        >
          {nazivKategorije(proizvod.kategorija)}
        </Link>
        <span>/</span>
        <span className="text-ink">{proizvod.naziv}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Galerija */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex gap-3 sm:flex-col">
            {proizvod.slike.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setAktivnaSlika(i)}
                aria-label={`Prikaži sliku ${i + 1}`}
                aria-pressed={aktivnaSlika === i}
                className={`relative h-20 w-16 shrink-0 overflow-hidden border-2 bg-smoke transition-colors ${
                  aktivnaSlika === i ? "border-cobalt" : "border-transparent"
                }`}
              >
                <Image
                  src={s}
                  alt=""
                  aria-hidden
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-smoke">
            <Image
              src={proizvod.slike[aktivnaSlika]}
              alt={proizvod.naziv}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute left-0 top-0 flex flex-col items-start gap-px">
              {proizvod.novo && (
                <span className="bg-cobalt px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  Novo
                </span>
              )}
              {proizvod.staraCijena && (
                <span className="bg-ink px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  −{popustPosto(proizvod.cijena, proizvod.staraCijena)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="label-tech label-tech-cobalt mb-2">
            {nazivKategorije(proizvod.kategorija)}
          </p>
          <h1 className="h-display text-[clamp(1.75rem,5vw,3rem)]">
            {proizvod.naziv}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span
              className={`text-2xl font-bold ${
                proizvod.staraCijena ? "text-cobalt" : ""
              }`}
            >
              {cijenaKM(proizvod.cijena)}
            </span>
            {proizvod.staraCijena && (
              <span className="text-base text-steel line-through">
                {cijenaKM(proizvod.staraCijena)}
              </span>
            )}
          </div>

          <p className="label-tech mt-5">Boja — {proizvod.boja}</p>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="label-tech">Veličina</p>
              <span className="label-tech">Tabela veličina</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {proizvod.velicine.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setVelicina(v);
                    setGreska(false);
                  }}
                  aria-pressed={velicina === v}
                  className={`h-12 min-w-14 border px-3 text-sm font-semibold transition-colors ${
                    velicina === v
                      ? "border-ink bg-ink text-white"
                      : "border-line hover:border-ink"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            {greska && (
              <p role="alert" className="mt-3 text-xs font-semibold text-cobalt">
                Odaberi veličinu prije dodavanja u korpu.
              </p>
            )}
          </div>

          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={dodaj}
              className="btn btn-primary flex-1"
            >
              Dodaj u korpu
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(proizvod.slug)}
              aria-label={saved ? "Ukloni iz favorita" : "Dodaj u favorite"}
              aria-pressed={saved}
              className={`flex h-12 w-12 shrink-0 items-center justify-center border transition-colors ${
                saved
                  ? "border-cobalt text-cobalt"
                  : "border-line hover:border-ink"
              }`}
            >
              <IconHeart filled={saved} className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-4 text-xs text-steel">
            Besplatna dostava za narudžbe iznad 100 KM · Povrat 30 dana
          </p>

          <div className="mt-8 border-t border-line">
            {SEKCIJE.map((naslov) => (
              <div key={naslov} className="border-b border-line">
                <button
                  type="button"
                  onClick={() =>
                    setOtvorena(otvorena === naslov ? null : naslov)
                  }
                  aria-expanded={otvorena === naslov}
                  className="flex w-full items-center justify-between py-4 text-left text-xs font-semibold uppercase tracking-[0.1em]"
                >
                  {naslov}
                  <span className="text-steel">
                    {otvorena === naslov ? (
                      <IconMinus className="h-4 w-4" />
                    ) : (
                      <IconPlus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                {otvorena === naslov && (
                  <p className="pb-5 text-sm leading-relaxed text-steel">
                    {sadrzajSekcije(naslov)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {srodni.length > 0 && (
        <section className="mt-20 sm:mt-28">
          <h2 className="h-display mb-8 text-[clamp(1.5rem,4vw,2.5rem)]">
            Uz ovo ide
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {srodni.map((p) => (
              <ProductCard key={p.slug} proizvod={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobilna traka */}
      <div className="fixed inset-x-0 bottom-0 z-[70] flex items-center gap-3 border-t border-line bg-white px-4 py-3 lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{proizvod.naziv}</p>
          <p className="text-sm font-bold">{cijenaKM(proizvod.cijena)}</p>
        </div>
        <button type="button" onClick={dodaj} className="btn btn-primary px-6">
          Dodaj
        </button>
      </div>
      <div className="h-16 lg:hidden" />
    </div>
  );
}
