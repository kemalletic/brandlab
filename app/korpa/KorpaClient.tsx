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
import {
  IconArrowLeft,
  IconBag,
  IconCheck,
  IconMinus,
  IconPlus,
  IconTrash,
} from "@/components/Icons";

export default function KorpaClient() {
  const { cart, updateQty, removeFromCart, hydrated } = useStore();

  const stavke = cart
    .map((item) => ({ item, proizvod: nadjiProizvod(item.slug) }))
    .filter((x) => x.proizvod);

  const medjuzbir = stavke.reduce(
    (sum, { item, proizvod }) => sum + (proizvod?.cijena ?? 0) * item.kolicina,
    0,
  );
  const komada = stavke.reduce((s, { item }) => s + item.kolicina, 0);
  const dostava =
    medjuzbir === 0 || medjuzbir >= PRAG_BESPLATNE_DOSTAVE ? 0 : CIJENA_DOSTAVE;
  const ukupno = medjuzbir + dostava;
  const preostalo = Math.max(0, PRAG_BESPLATNE_DOSTAVE - medjuzbir);
  const napredak = Math.min(100, (medjuzbir / PRAG_BESPLATNE_DOSTAVE) * 100);

  if (!hydrated) return <div className="min-h-[60vh]" />;

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14">
      <nav className="label-tech mb-6 flex gap-2">
        <Link href="/" className="hover:text-ink">
          Početna
        </Link>
        <span>/</span>
        <span className="text-ink">Korpa</span>
      </nav>

      <div className="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="h-display text-[clamp(2rem,7vw,4.5rem)]">Korpa</h1>
        {komada > 0 && (
          <span className="label-tech">
            {komada} {komada === 1 ? "komad" : "komada"}
          </span>
        )}
      </div>

      {stavke.length === 0 ? (
        <div className="flex flex-col items-center border border-line px-6 py-20 text-center sm:py-28">
          <IconBag className="mb-5 h-14 w-14 text-line" strokeWidth={1.1} />
          <p className="h-display-narrow mb-2 text-2xl">Korpa je prazna</p>
          <p className="mb-8 max-w-xs text-sm text-steel">
            Nova kolekcija te čeka u shopu.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-primary">
              Idi u shop
            </Link>
            <Link href="/favoriti" className="btn btn-ghost-dark">
              Pogledaj favorite
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          <div>
            <div className="hidden border-b border-line pb-3 lg:grid lg:grid-cols-[1fr_140px_110px_44px] lg:items-center lg:gap-4">
              <span className="label-tech">Proizvod</span>
              <span className="label-tech">Količina</span>
              <span className="label-tech text-right">Ukupno</span>
              <span />
            </div>

            <ul>
              {stavke.map(({ item, proizvod }) => (
                <li
                  key={`${item.slug}-${item.velicina}`}
                  className="relative grid grid-cols-[80px_1fr] items-start gap-3 border-b border-line py-5 sm:gap-4 lg:grid-cols-[1fr_140px_110px_44px] lg:items-center"
                >
                  {/* slika — mobitel */}
                  <Link
                    href={`/proizvod/${item.slug}`}
                    className="relative aspect-[3/4] w-20 overflow-hidden bg-smoke lg:hidden"
                  >
                    <Image
                      src={proizvod!.slike[0]}
                      alt={proizvod!.naziv}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>

                  {/* naziv + slika na desktopu */}
                  <div className="flex gap-4">
                    <Link
                      href={`/proizvod/${item.slug}`}
                      className="relative hidden aspect-[3/4] w-20 shrink-0 overflow-hidden bg-smoke lg:block"
                    >
                      <Image
                        src={proizvod!.slike[0]}
                        alt={proizvod!.naziv}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-col justify-center">
                      <p className="label-tech">
                        {nazivKategorije(proizvod!.kategorija)}
                      </p>
                      <Link
                        href={`/proizvod/${item.slug}`}
                        className="mt-1 pr-10 font-semibold leading-snug hover:text-cobalt lg:pr-0"
                      >
                        {proizvod!.naziv}
                      </Link>
                      <p className="mt-1 text-sm text-steel">
                        <span className="whitespace-nowrap">
                          Veličina {item.velicina}
                        </span>
                        <span className="hidden sm:inline">
                          {" "}· {cijenaKM(proizvod!.cijena)}
                        </span>
                      </p>

                      {/* količina + cijena — mobitel */}
                      <div className="mt-3 flex items-center justify-between gap-2 lg:hidden">
                        <div className="flex shrink-0 items-center border border-line">
                          <button
                            type="button"
                            aria-label="Smanji količinu"
                            onClick={() => updateQty(item.slug, item.velicina, -1)}
                            className="flex h-9 w-9 items-center justify-center text-steel hover:bg-smoke hover:text-ink"
                          >
                            <IconMinus className="h-4 w-4" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">
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
                        <span className="whitespace-nowrap text-sm font-semibold">
                          {cijenaKM(proizvod!.cijena * item.kolicina)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* količina — desktop */}
                  <div className="hidden lg:flex">
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        aria-label="Smanji količinu"
                        onClick={() => updateQty(item.slug, item.velicina, -1)}
                        className="flex h-10 w-10 items-center justify-center text-steel hover:bg-smoke hover:text-ink"
                      >
                        <IconMinus className="h-4 w-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium">
                        {item.kolicina}
                      </span>
                      <button
                        type="button"
                        aria-label="Povećaj količinu"
                        onClick={() => updateQty(item.slug, item.velicina, 1)}
                        className="flex h-10 w-10 items-center justify-center text-steel hover:bg-smoke hover:text-ink"
                      >
                        <IconPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <span className="hidden text-right font-semibold lg:block">
                    {cijenaKM(proizvod!.cijena * item.kolicina)}
                  </span>

                  {/* ukloni — mobitel gore desno, desktop u koloni */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.slug, item.velicina)}
                    aria-label={`Ukloni ${proizvod!.naziv} iz korpe`}
                    className="absolute right-0 top-4 flex h-10 w-10 items-center justify-center text-steel hover:text-cobalt lg:static lg:justify-self-end"
                  >
                    <IconTrash className="h-[18px] w-[18px]" />
                  </button>
                </li>
              ))}
            </ul>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] hover:text-cobalt"
            >
              <IconArrowLeft className="h-4 w-4" />
              Nastavi kupovinu
            </Link>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-line p-6">
              <h2 className="h-display-narrow mb-5 text-lg">Sažetak</h2>

              <div className="mb-5">
                {preostalo > 0 ? (
                  <p className="mb-2 text-xs text-steel">
                    Još <strong className="text-ink">{cijenaKM(preostalo)}</strong>{" "}
                    do besplatne dostave
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

              <dl className="space-y-3 border-t border-line pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-steel">Međuzbir</dt>
                  <dd>{cijenaKM(medjuzbir)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-steel">Dostava</dt>
                  <dd className={dostava === 0 ? "font-semibold text-cobalt" : ""}>
                    {dostava === 0 ? "Besplatno" : cijenaKM(dostava)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                  <dt>Ukupno</dt>
                  <dd>{cijenaKM(ukupno)}</dd>
                </div>
              </dl>

              <Link href="/naplata" className="btn btn-primary mt-6 w-full">
                Na naplatu
              </Link>

              <p className="mt-4 text-center text-xs leading-relaxed text-steel">
                Povrat 30 dana · Dostava u BiH za 48 sati
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
