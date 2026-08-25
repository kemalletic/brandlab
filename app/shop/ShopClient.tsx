"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  KATEGORIJE,
  MAX_CIJENA,
  PROIZVODI,
  SVE_VELICINE,
  nazivKategorije,
} from "@/lib/products";
import type { Kategorija } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import { cijenaKM } from "@/lib/format";

type Sort = "novo" | "cijena-rastuce" | "cijena-opadajuce";

const SORT_OPCIJE: { value: Sort; label: string }[] = [
  { value: "novo", label: "Najnovije" },
  { value: "cijena-rastuce", label: "Cijena: niža → viša" },
  { value: "cijena-opadajuce", label: "Cijena: viša → niža" },
];

export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kategorijaParam = searchParams.get("kategorija") as Kategorija | null;

  const [velicine, setVelicine] = useState<string[]>([]);
  const [maxCijena, setMaxCijena] = useState(MAX_CIJENA);
  const [sort, setSort] = useState<Sort>("novo");
  const [filterOpen, setFilterOpen] = useState(false);

  const aktivnaKategorija = KATEGORIJE.some((k) => k.slug === kategorijaParam)
    ? kategorijaParam
    : null;

  function postaviKategoriju(k: Kategorija | null) {
    router.push(k ? `/shop?kategorija=${k}` : "/shop", { scroll: false });
  }

  function toggleVelicina(v: string) {
    setVelicine((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  }

  function resetuj() {
    setVelicine([]);
    setMaxCijena(MAX_CIJENA);
    setSort("novo");
    router.push("/shop", { scroll: false });
  }

  const filtrirani = useMemo(() => {
    let lista = PROIZVODI.filter((p) => {
      if (aktivnaKategorija && p.kategorija !== aktivnaKategorija) return false;
      if (p.cijena > maxCijena) return false;
      if (velicine.length > 0 && !p.velicine.some((v) => velicine.includes(v)))
        return false;
      return true;
    });

    if (sort === "cijena-rastuce") {
      lista = [...lista].sort((a, b) => a.cijena - b.cijena);
    } else if (sort === "cijena-opadajuce") {
      lista = [...lista].sort((a, b) => b.cijena - a.cijena);
    } else {
      lista = [...lista].sort(
        (a, b) => Number(Boolean(b.novo)) - Number(Boolean(a.novo)),
      );
    }
    return lista;
  }, [aktivnaKategorija, velicine, maxCijena, sort]);

  const imaFiltera =
    Boolean(aktivnaKategorija) || velicine.length > 0 || maxCijena < MAX_CIJENA;

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <p className="label-tech mb-3">Kategorija</p>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => postaviKategoriju(null)}
              className={`text-sm ${
                !aktivnaKategorija
                  ? "font-semibold text-cobalt"
                  : "text-steel hover:text-ink"
              }`}
            >
              Sve
            </button>
          </li>
          {KATEGORIJE.map((k) => (
            <li key={k.slug}>
              <button
                type="button"
                onClick={() => postaviKategoriju(k.slug)}
                className={`text-sm ${
                  aktivnaKategorija === k.slug
                    ? "font-semibold text-cobalt"
                    : "text-steel hover:text-ink"
                }`}
              >
                {k.naziv}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="label-tech mb-3">Veličina</p>
        <div className="flex flex-wrap gap-2">
          {SVE_VELICINE.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => toggleVelicina(v)}
              aria-pressed={velicine.includes(v)}
              className={`min-w-11 border px-2.5 py-2 text-xs font-semibold transition-colors ${
                velicine.includes(v)
                  ? "border-cobalt bg-cobalt text-white"
                  : "border-line text-steel hover:border-ink hover:text-ink"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-tech mb-3">Cijena do {cijenaKM(maxCijena)}</p>
        <input
          type="range"
          min={40}
          max={MAX_CIJENA}
          step={10}
          value={maxCijena}
          onChange={(e) => setMaxCijena(Number(e.target.value))}
          aria-label="Maksimalna cijena"
          className="w-full accent-cobalt"
        />
      </div>

      {imaFiltera && (
        <button
          type="button"
          onClick={resetuj}
          className="link-sweep text-xs font-semibold uppercase tracking-[0.1em]"
        >
          Poništi filtere
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14">
      <nav className="label-tech mb-6 flex gap-2">
        <Link href="/" className="hover:text-ink">
          Početna
        </Link>
        <span>/</span>
        <span className="text-ink">
          {aktivnaKategorija ? nazivKategorije(aktivnaKategorija) : "Shop"}
        </span>
      </nav>

      <h1 className="h-display mb-8 text-[clamp(2rem,7vw,4.5rem)]">
        {aktivnaKategorija ? nazivKategorije(aktivnaKategorija) : "Sve"}
      </h1>

      <div className="mb-6 flex items-center justify-between gap-4 border-y border-line py-3">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="text-xs font-semibold uppercase tracking-[0.1em] lg:invisible"
        >
          Filteri {imaFiltera && <span className="text-cobalt">•</span>}
        </button>

        <p className="label-tech hidden lg:block">
          {filtrirani.length}{" "}
          {filtrirani.length === 1 ? "proizvod" : "proizvoda"}
        </p>

        <label className="flex items-center gap-2 text-xs">
          <span className="label-tech hidden sm:inline">Sortiraj</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sortiraj proizvode"
            className="border border-line px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] outline-none focus:border-cobalt"
          >
            {SORT_OPCIJE.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-10">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24">{filterPanel}</div>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="label-tech mb-5 lg:hidden">
            {filtrirani.length}{" "}
            {filtrirani.length === 1 ? "proizvod" : "proizvoda"}
          </p>

          {filtrirani.length === 0 ? (
            <div className="border border-line px-6 py-20 text-center">
              <p className="h-display-narrow mb-2 text-xl">Nema proizvoda</p>
              <p className="mb-6 text-sm text-steel">
                Nijedan komad ne odgovara odabranim filterima.
              </p>
              <button type="button" onClick={resetuj} className="btn btn-dark">
                Poništi filtere
              </button>
            </div>
          ) : (
            <ProductGrid proizvodi={filtrirani} prioritetPrvih={4} />
          )}
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[88] lg:hidden">
          <button
            type="button"
            aria-label="Zatvori filtere"
            onClick={() => setFilterOpen(false)}
            className="fade-in absolute inset-0 bg-ink/50"
          />
          <div className="slide-in-up absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-white px-5 pb-8 pt-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="h-display-narrow text-lg">Filteri</h2>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                aria-label="Zatvori"
                className="text-2xl leading-none text-steel"
              >
                ✕
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="btn btn-primary mt-8 w-full"
            >
              Prikaži {filtrirani.length}{" "}
              {filtrirani.length === 1 ? "proizvod" : "proizvoda"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
