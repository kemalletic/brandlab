"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { nadjiProizvod } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";

export default function FavoritiClient() {
  const { wishlist, hydrated } = useStore();

  if (!hydrated) return <div className="min-h-[60vh]" />;

  const proizvodi = wishlist
    .map((slug) => nadjiProizvod(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14">
      <nav className="label-tech mb-6 flex gap-2">
        <Link href="/" className="hover:text-ink">
          Početna
        </Link>
        <span>/</span>
        <span className="text-ink">Favoriti</span>
      </nav>

      <h1 className="h-display mb-3 text-[clamp(2rem,7vw,4.5rem)]">Favoriti</h1>
      <p className="label-tech mb-10">
        {proizvodi.length}{" "}
        {proizvodi.length === 1 ? "sačuvan komad" : "sačuvanih komada"}
      </p>

      {proizvodi.length === 0 ? (
        <div className="border border-line px-6 py-24 text-center">
          <p className="h-display-narrow mb-3 text-2xl">Još nema favorita</p>
          <p className="mb-8 text-sm text-steel">
            Klikni srce na proizvodu da ga sačuvaš za kasnije.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Pregledaj kolekciju
          </Link>
        </div>
      ) : (
        <ProductGrid proizvodi={proizvodi} prioritetPrvih={4} />
      )}
    </div>
  );
}
