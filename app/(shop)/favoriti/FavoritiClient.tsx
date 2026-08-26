"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { nadjiProizvod, nazivKategorije } from "@/lib/products";
import { cijenaKM, popustPosto } from "@/lib/format";
import { IconClose, IconHeart, IconTrash } from "@/components/Icons";
import type { Product } from "@/lib/types";

export default function FavoritiClient() {
  const { wishlist, hydrated, toggleWishlist } = useStore();
  const [odabran, setOdabran] = useState<Product | null>(null);

  if (!hydrated) return <div className="min-h-[60vh]" />;

  const proizvodi = wishlist
    .map((slug) => nadjiProizvod(slug))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14">
      <nav className="label-tech mb-6 flex gap-2">
        <Link href="/" className="hover:text-ink">
          Početna
        </Link>
        <span>/</span>
        <span className="text-ink">Favoriti</span>
      </nav>

      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="h-display text-[clamp(2rem,7vw,4.5rem)]">Favoriti</h1>
          {proizvodi.length > 0 && (
            <span className="label-tech">
              {proizvodi.length}{" "}
              {proizvodi.length === 1 ? "komad" : "komada"}
            </span>
          )}
        </div>
        {proizvodi.length > 0 && (
          <button
            type="button"
            onClick={() => proizvodi.forEach((p) => toggleWishlist(p.slug))}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-steel hover:text-cobalt"
          >
            <IconTrash className="h-4 w-4" />
            Isprazni listu
          </button>
        )}
      </div>

      {proizvodi.length === 0 ? (
        <div className="flex flex-col items-center border border-line px-6 py-20 text-center sm:py-28">
          <IconHeart className="mb-5 h-14 w-14 text-line" strokeWidth={1.1} />
          <p className="h-display-narrow mb-2 text-2xl">Još nema favorita</p>
          <p className="mb-8 max-w-xs text-sm text-steel">
            Klikni srce na proizvodu da ga sačuvaš za kasnije.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Pregledaj kolekciju
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          {proizvodi.map((p, i) => (
            <FavoritKartica
              key={p.slug}
              proizvod={p}
              priority={i < 4}
              onDodaj={() => setOdabran(p)}
            />
          ))}
        </div>
      )}

      {odabran && (
        <VelicinaModal proizvod={odabran} onClose={() => setOdabran(null)} />
      )}
    </div>
  );
}

function FavoritKartica({
  proizvod,
  priority,
  onDodaj,
}: {
  proizvod: Product;
  priority: boolean;
  onDodaj: () => void;
}) {
  const { toggleWishlist } = useStore();

  return (
    <div className="group relative">
      <Link href={`/proizvod/${proizvod.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-smoke">
          <Image
            src={proizvod.slike[0]}
            alt={proizvod.naziv}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {proizvod.staraCijena && (
            <span className="absolute left-0 top-0 bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              −{popustPosto(proizvod.cijena, proizvod.staraCijena)}%
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(proizvod.slug)}
        aria-label={`Ukloni ${proizvod.naziv} iz favorita`}
        className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center text-cobalt hover:text-ink"
      >
        <IconHeart filled className="h-5 w-5" />
      </button>

      <div className="pt-3">
        <p className="label-tech">{nazivKategorije(proizvod.kategorija)}</p>
        <Link
          href={`/proizvod/${proizvod.slug}`}
          className="mt-1 block text-sm font-semibold leading-snug hover:text-cobalt"
        >
          {proizvod.naziv}
        </Link>
        <p className="mt-1 flex items-baseline gap-2 text-sm">
          <span
            className={
              proizvod.staraCijena ? "font-semibold text-cobalt" : "font-semibold"
            }
          >
            {cijenaKM(proizvod.cijena)}
          </span>
          {proizvod.staraCijena && (
            <span className="text-xs text-steel line-through">
              {cijenaKM(proizvod.staraCijena)}
            </span>
          )}
        </p>

        <button
          type="button"
          onClick={onDodaj}
          className="mt-3 h-10 w-full border border-ink text-xs font-bold uppercase tracking-[0.1em] transition-colors hover:bg-ink hover:text-white"
        >
          Dodaj u korpu
        </button>
      </div>
    </div>
  );
}

/** Favoriti ne pamte veličinu, pa se ona bira ovdje prije dodavanja. */
function VelicinaModal({
  proizvod,
  onClose,
}: {
  proizvod: Product;
  onClose: () => void;
}) {
  const { addToCart } = useStore();
  const [velicina, setVelicina] = useState<string | null>(null);
  const [greska, setGreska] = useState(false);

  function potvrdi() {
    if (!velicina) {
      setGreska(true);
      return;
    }
    addToCart(proizvod.slug, velicina);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[92] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Zatvori"
        onClick={onClose}
        className="fade-in absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-label={`Odaberi veličinu — ${proizvod.naziv}`}
        className="slide-in-up relative w-full max-w-md bg-white p-6 sm:slide-in-up"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="label-tech">{nazivKategorije(proizvod.kategorija)}</p>
            <h2 className="h-display-narrow mt-1 truncate text-lg">
              {proizvod.naziv}
            </h2>
            <p className="mt-1 text-sm font-semibold">
              {cijenaKM(proizvod.cijena)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori"
            className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center text-steel hover:text-ink"
          >
            <IconClose />
          </button>
        </div>

        <p className="label-tech mb-3">Veličina</p>
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

        <button
          type="button"
          onClick={potvrdi}
          className="btn btn-primary mt-6 w-full"
        >
          Dodaj u korpu
        </button>
      </div>
    </div>
  );
}
