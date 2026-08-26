"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { nadjiProizvod, PRAG_BESPLATNE_DOSTAVE } from "@/lib/products";
import { cijenaKM } from "@/lib/format";
import { IconBag, IconCheck, IconClose, IconMinus, IconPlus, IconTrash } from "./Icons";

export default function CartDrawer() {
  const { cartOpen } = useStore();
  if (!cartOpen) return null;
  return <DrawerPanel />;
}

function DrawerPanel() {
  const { cart, setCartOpen, updateQty, removeFromCart } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [setCartOpen]);

  const zatvori = () => setCartOpen(false);

  const stavke = cart
    .map((item) => ({ item, proizvod: nadjiProizvod(item.slug) }))
    .filter((x) => x.proizvod);

  const medjuzbir = stavke.reduce(
    (sum, { item, proizvod }) => sum + (proizvod?.cijena ?? 0) * item.kolicina,
    0,
  );
  const komada = stavke.reduce((s, { item }) => s + item.kolicina, 0);
  const preostalo = Math.max(0, PRAG_BESPLATNE_DOSTAVE - medjuzbir);
  const napredak = Math.min(100, (medjuzbir / PRAG_BESPLATNE_DOSTAVE) * 100);

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Zatvori korpu"
        onClick={zatvori}
        className="fade-in absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-label="Korpa"
        className="slide-in-right absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="h-display-narrow text-lg">
            Korpa
            {komada > 0 && (
              <span className="ml-2 text-sm font-medium text-steel">
                {komada}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={zatvori}
            aria-label="Zatvori"
            className="-mr-2 flex h-10 w-10 items-center justify-center text-steel hover:text-ink"
          >
            <IconClose />
          </button>
        </div>

        {stavke.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-16 text-center">
            <IconBag className="h-12 w-12 text-line" strokeWidth={1.2} />
            <p className="h-display-narrow text-xl">Korpa je prazna</p>
            <p className="max-w-[15rem] text-sm text-steel">
              Nova kolekcija te čeka u shopu.
            </p>
            <Link href="/shop" onClick={zatvori} className="btn btn-dark mt-2">
              Idi u shop
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-5 py-3">
              {preostalo > 0 ? (
                <p className="mb-2 text-xs text-steel">
                  Još{" "}
                  <strong className="text-ink">{cijenaKM(preostalo)}</strong> do
                  besplatne dostave
                </p>
              ) : (
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-cobalt">
                  <IconCheck className="h-4 w-4" />
                  Ostvarena besplatna dostava
                </p>
              )}
              <div
                className="h-[3px] w-full bg-line"
                role="progressbar"
                aria-valuenow={Math.round(napredak)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Napredak do besplatne dostave"
              >
                <div
                  className="h-full bg-cobalt transition-[width] duration-500"
                  style={{ width: `${napredak}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {stavke.map(({ item, proizvod }) => (
                <div
                  key={`${item.slug}-${item.velicina}`}
                  className="flex gap-4 border-b border-line py-4"
                >
                  <Link
                    href={`/proizvod/${item.slug}`}
                    onClick={zatvori}
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

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/proizvod/${item.slug}`}
                          onClick={zatvori}
                          className="block truncate text-sm font-semibold hover:text-cobalt"
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
                        aria-label={`Ukloni ${proizvod!.naziv} iz korpe`}
                        className="-mr-1.5 -mt-1.5 flex h-9 w-9 shrink-0 items-center justify-center text-steel hover:text-cobalt"
                      >
                        <IconTrash className="h-[18px] w-[18px]" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          aria-label="Smanji količinu"
                          onClick={() => updateQty(item.slug, item.velicina, -1)}
                          className="flex h-9 w-9 items-center justify-center text-steel hover:bg-smoke hover:text-ink"
                        >
                          <IconMinus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.kolicina}
                        </span>
                        <button
                          type="button"
                          aria-label="Povećaj količinu"
                          onClick={() => updateQty(item.slug, item.velicina, 1)}
                          className="flex h-9 w-9 items-center justify-center text-steel hover:bg-smoke hover:text-ink"
                        >
                          <IconPlus className="h-4 w-4" />
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
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-steel">Međuzbir</span>
                <span className="font-semibold">{cijenaKM(medjuzbir)}</span>
              </div>
              <p className="mb-4 text-xs text-steel">
                Dostava se obračunava na naplati.
              </p>
              <Link
                href="/naplata"
                onClick={zatvori}
                className="btn btn-primary w-full"
              >
                Na naplatu
              </Link>
              <Link
                href="/korpa"
                onClick={zatvori}
                className="link-sweep mx-auto mt-3 block w-fit text-center text-xs font-semibold uppercase tracking-[0.1em]"
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
