"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  CIJENA_DOSTAVE,
  PRAG_BESPLATNE_DOSTAVE,
  nadjiProizvod,
  nazivKategorije,
} from "@/lib/products";
import { cijenaKM } from "@/lib/format";

export default function KorpaClient() {
  const { cart, updateQty, removeFromCart, hydrated } = useStore();

  const stavke = cart
    .map((item) => ({ item, proizvod: nadjiProizvod(item.slug) }))
    .filter((x) => x.proizvod);

  const medjuzbir = stavke.reduce(
    (sum, { item, proizvod }) => sum + (proizvod?.cijena ?? 0) * item.kolicina,
    0,
  );
  const dostava =
    medjuzbir === 0 || medjuzbir >= PRAG_BESPLATNE_DOSTAVE
      ? 0
      : CIJENA_DOSTAVE;
  const ukupno = medjuzbir + dostava;

  if (!hydrated) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14">
      <nav className="label-tech mb-6 flex gap-2">
        <Link href="/" className="hover:text-ink">
          Početna
        </Link>
        <span>/</span>
        <span className="text-ink">Korpa</span>
      </nav>

      <h1 className="h-display mb-10 text-[clamp(2rem,7vw,4.5rem)]">Korpa</h1>

      {stavke.length === 0 ? (
        <div className="border border-line px-6 py-24 text-center">
          <p className="h-display-narrow mb-3 text-2xl">Korpa je prazna</p>
          <p className="mb-8 text-sm text-steel">
            Nova kolekcija te čeka u shopu.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Idi u shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="hidden border-b border-line pb-3 lg:grid lg:grid-cols-[1fr_120px_120px_40px] lg:gap-4">
              <span className="label-tech">Proizvod</span>
              <span className="label-tech">Količina</span>
              <span className="label-tech text-right">Ukupno</span>
              <span />
            </div>

            {stavke.map(({ item, proizvod }) => (
              <div
                key={`${item.slug}-${item.velicina}`}
                className="grid grid-cols-[88px_1fr] gap-4 border-b border-line py-5 lg:grid-cols-[1fr_120px_120px_40px] lg:items-center"
              >
                <Link
                  href={`/proizvod/${item.slug}`}
                  className="relative h-28 w-22 overflow-hidden bg-smoke lg:hidden"
                >
                  <Image
                    src={proizvod!.slike[0]}
                    alt={proizvod!.naziv}
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex gap-4">
                  <Link
                    href={`/proizvod/${item.slug}`}
                    className="relative hidden h-28 w-22 shrink-0 overflow-hidden bg-smoke lg:block"
                  >
                    <Image
                      src={proizvod!.slike[0]}
                      alt={proizvod!.naziv}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-col justify-center">
                    <p className="label-tech">
                      {nazivKategorije(proizvod!.kategorija)}
                    </p>
                    <Link
                      href={`/proizvod/${item.slug}`}
                      className="mt-1 font-semibold hover:text-cobalt"
                    >
                      {proizvod!.naziv}
                    </Link>
                    <p className="mt-1 text-sm text-steel">
                      Veličina {item.velicina} · {cijenaKM(proizvod!.cijena)}
                    </p>
                  </div>
                </div>

                <div className="col-start-2 flex items-center justify-between lg:col-start-auto lg:justify-start">
                  <div className="flex items-center border border-line">
                    <button
                      type="button"
                      aria-label="Smanji količinu"
                      onClick={() => updateQty(item.slug, item.velicina, -1)}
                      className="h-10 w-10 hover:bg-smoke"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm">
                      {item.kolicina}
                    </span>
                    <button
                      type="button"
                      aria-label="Povećaj količinu"
                      onClick={() => updateQty(item.slug, item.velicina, 1)}
                      className="h-10 w-10 hover:bg-smoke"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold lg:hidden">
                    {cijenaKM(proizvod!.cijena * item.kolicina)}
                  </span>
                </div>

                <span className="hidden text-right font-semibold lg:block">
                  {cijenaKM(proizvod!.cijena * item.kolicina)}
                </span>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.slug, item.velicina)}
                  aria-label="Ukloni iz korpe"
                  className="col-start-2 justify-self-start text-xs font-semibold uppercase tracking-[0.1em] text-steel hover:text-ink lg:col-start-auto lg:justify-self-end lg:text-lg lg:normal-case"
                >
                  <span className="lg:hidden">Ukloni</span>
                  <span className="hidden lg:inline">✕</span>
                </button>
              </div>
            ))}

            <Link
              href="/shop"
              className="link-sweep mt-6 inline-block text-xs font-semibold uppercase tracking-[0.1em]"
            >
              ← Nastavi kupovinu
            </Link>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-line p-6">
              <h2 className="h-display-narrow mb-5 text-lg">Sažetak</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-steel">Međuzbir</dt>
                  <dd>{cijenaKM(medjuzbir)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-steel">Dostava</dt>
                  <dd>{dostava === 0 ? "Besplatno" : cijenaKM(dostava)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                  <dt>Ukupno</dt>
                  <dd>{cijenaKM(ukupno)}</dd>
                </div>
              </dl>

              {medjuzbir < PRAG_BESPLATNE_DOSTAVE && (
                <p className="mt-4 bg-smoke px-3 py-2 text-xs text-steel">
                  Još {cijenaKM(PRAG_BESPLATNE_DOSTAVE - medjuzbir)} do
                  besplatne dostave.
                </p>
              )}

              <Link href="/naplata" className="btn btn-primary mt-6 w-full">
                Na naplatu
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
