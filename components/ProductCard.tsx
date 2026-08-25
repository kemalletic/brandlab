"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { nazivKategorije } from "@/lib/products";
import { cijenaKM, popustPosto } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({
  proizvod,
  priority = false,
}: {
  proizvod: Product;
  priority?: boolean;
}) {
  const { toggleWishlist, isWishlisted, hydrated } = useStore();
  const saved = hydrated && isWishlisted(proizvod.slug);
  const drugaSlika = proizvod.slike[1] ?? proizvod.slike[0];

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
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={drugaSlika}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          <div className="absolute left-0 top-0 flex flex-col items-start gap-px">
            {proizvod.novo && (
              <span className="bg-cobalt px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                Novo
              </span>
            )}
            {proizvod.staraCijena && (
              <span className="bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                −{popustPosto(proizvod.cijena, proizvod.staraCijena)}%
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(proizvod.slug)}
        aria-label={saved ? "Ukloni iz favorita" : "Dodaj u favorite"}
        aria-pressed={saved}
        className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center text-lg transition-colors ${
          saved ? "text-cobalt" : "text-ink/40 hover:text-ink"
        }`}
      >
        {saved ? "♥" : "♡"}
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
          <span className={proizvod.staraCijena ? "font-semibold text-cobalt" : "font-semibold"}>
            {cijenaKM(proizvod.cijena)}
          </span>
          {proizvod.staraCijena && (
            <span className="text-xs text-steel line-through">
              {cijenaKM(proizvod.staraCijena)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
