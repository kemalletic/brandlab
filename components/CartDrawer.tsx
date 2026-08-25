"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { nadjiProizvod, PRAG_BESPLATNE_DOSTAVE } from "@/lib/products";
import { cijenaKM } from "@/lib/format";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart } =
    useStore();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const stavke = cart
    .map((item) => ({ item, proizvod: nadjiProizvod(item.slug) }))
    .filter((x) => x.proizvod);

  const medjuzbir = stavke.reduce(
    (sum, { item, proizvod }) => sum + (proizvod?.cijena ?? 0) * item.kolicina,
    0,
  );
  const preostaloZaBesplatnu = Math.max(
    0,
    PRAG_BESPLATNE_DOSTAVE - medjuzbir,
  );

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Zatvori korpu"
        onClick={() => setCartOpen(false)}
        className="fade-in absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <div className="slide-in-right absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="h-display-narrow text-lg">Korpa</h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Zatvori"
            className="text-2xl leading-none text-steel hover:text-ink"
          >
            ✕
          </button>
        </div>

        {stavke.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="label-tech">Korpa je prazna</p>
            <p className="text-sm text-steel">
              Dodaj nešto iz nove kolekcije.
            </p>
            <Link
              href="/shop"
              onClick={() => setCartOpen(false)}
              className="btn btn-dark"
            >
              Idi u shop
            </Link>
          </div>
        ) : (
          <>
            {preostaloZaBesplatnu > 0 && (
              <p className="border-b border-line bg-smoke px-5 py-2.5 text-xs text-steel">
                Još <strong className="text-ink">{cijenaKM(preostaloZaBesplatnu)}</strong> do
                besplatne dostave.
              </p>
            )}
            <div className="flex-1 overflow-y-auto px-5">
              {stavke.map(({ item, proizvod }) => (
                <div
                  key={`${item.slug}-${item.velicina}`}
                  className="flex gap-4 border-b border-line py-4"
                >
                  <Link
                    href={`/proizvod/${item.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="relative h-24 w-20 shrink-0 overflow-hidden bg-smoke"
                  >
                    <Image
                      src={proizvod!.slike[0]}
                      alt={proizvod!.naziv}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/proizvod/${item.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="text-sm font-semibold hover:text-cobalt"
                        >
                          {proizvod!.naziv}
                        </Link>
                        <p className="label-tech mt-1">
                          Veličina {item.velicina}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.slug, item.velicina)}
                        aria-label="Ukloni iz korpe"
                        className="text-steel hover:text-ink"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          aria-label="Smanji količinu"
                          onClick={() =>
                            updateQty(item.slug, item.velicina, -1)
                          }
                          className="h-8 w-8 text-sm hover:bg-smoke"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.kolicina}
                        </span>
                        <button
                          type="button"
                          aria-label="Povećaj količinu"
                          onClick={() =>
                            updateQty(item.slug, item.velicina, 1)
                          }
                          className="h-8 w-8 text-sm hover:bg-smoke"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {cijenaKM(proizvod!.cijena * item.kolicina)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line px-5 py-4">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-steel">Međuzbir</span>
                <span className="font-semibold">{cijenaKM(medjuzbir)}</span>
              </div>
              <Link
                href="/naplata"
                onClick={() => setCartOpen(false)}
                className="btn btn-primary w-full"
              >
                Na naplatu
              </Link>
              <Link
                href="/korpa"
                onClick={() => setCartOpen(false)}
                className="link-sweep mt-3 block text-center text-xs font-semibold uppercase tracking-[0.1em]"
              >
                Pogledaj korpu
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
