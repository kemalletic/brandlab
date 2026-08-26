"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { KATEGORIJE, SVE_VELICINE, nazivKategorije } from "@/lib/products";
import { cijenaKM, normalizuj, popustPosto } from "@/lib/format";
import type { Kategorija, Product } from "@/lib/types";
import { useAdmin } from "@/lib/admin/store";
import { IconCheck, IconClose, IconPlus } from "@/components/Icons";

/** Slike koje već stoje u public/products/ — admin bira iz njih. */
const DOSTUPNE_SLIKE = [
  "duks-01", "duks-02", "duks-05", "duks-06", "duks-08", "duks-10", "duks-11",
  "majica-01", "majica-02", "majica-03", "majica-07",
  "jakna-01", "jakna-02", "jakna-04",
  "pantalone-01", "pantalone-02", "pantalone-03", "sorc-05",
  "patike-01", "patike-02", "patike-06",
  "kapa-01", "naocale-01",
  "dodatak-01", "dodatak-03", "dodatak-04", "dodatak-05", "dodatak-07",
  "hero-01", "hero-02", "look-01", "look-03", "look-05", "look-06", "look-08",
].map((n) => `/products/${n}.jpg`);

type Greske = Partial<Record<string, string>>;

const PRAZAN: Product = {
  slug: "",
  naziv: "",
  kategorija: "duksevi",
  cijena: 0,
  velicine: [],
  boja: "",
  opis: "",
  materijal: "",
  odrzavanje: "",
  slike: [],
};

export default function ProizvodForma({
  pocetni,
  onSacuvaj,
  tekstDugmeta,
}: {
  pocetni?: Product;
  onSacuvaj: (p: Product) => void;
  tekstDugmeta: string;
}) {
  const { proizvodi } = useAdmin();
  const [p, setP] = useState<Product>(pocetni ?? PRAZAN);
  const [slugRucno, setSlugRucno] = useState(Boolean(pocetni));
  const [greske, setGreske] = useState<Greske>({});
  const [biracSlika, setBiracSlika] = useState(false);

  function postavi<K extends keyof Product>(k: K, v: Product[K]) {
    setP((prev) => ({ ...prev, [k]: v }));
    setGreske((g) => ({ ...g, [k]: undefined }));
  }

  function postaviNaziv(naziv: string) {
    setP((prev) => ({
      ...prev,
      naziv,
      // Slug prati naziv dok ga korisnik ne preuzme ručno.
      slug: slugRucno
        ? prev.slug
        : normalizuj(naziv).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
    setGreske((g) => ({ ...g, naziv: undefined, slug: undefined }));
  }

  function toggleVelicina(v: string) {
    setP((prev) => ({
      ...prev,
      velicine: prev.velicine.includes(v)
        ? prev.velicine.filter((x) => x !== v)
        : [...prev.velicine, v],
    }));
    setGreske((g) => ({ ...g, velicine: undefined }));
  }

  function toggleSlika(s: string) {
    setP((prev) => ({
      ...prev,
      slike: prev.slike.includes(s)
        ? prev.slike.filter((x) => x !== s)
        : [...prev.slike, s],
    }));
    setGreske((g) => ({ ...g, slike: undefined }));
  }

  const zauzetSlug = useMemo(
    () =>
      proizvodi.some(
        (x) => x.slug === p.slug.trim() && x.slug !== pocetni?.slug,
      ),
    [proizvodi, p.slug, pocetni?.slug],
  );

  function posalji(e: React.FormEvent) {
    e.preventDefault();
    const g: Greske = {};
    if (!p.naziv.trim()) g.naziv = "Unesi naziv proizvoda.";
    if (!p.slug.trim()) g.slug = "Slug ne smije biti prazan.";
    else if (!/^[a-z0-9-]+$/.test(p.slug))
      g.slug = "Slug smije imati samo mala slova, brojeve i crtice.";
    else if (zauzetSlug) g.slug = "Proizvod s ovim slugom već postoji.";
    if (!p.cijena || p.cijena <= 0) g.cijena = "Cijena mora biti veća od nule.";
    if (p.staraCijena && p.staraCijena <= p.cijena)
      g.staraCijena = "Stara cijena mora biti veća od trenutne.";
    if (p.velicine.length === 0) g.velicine = "Odaberi bar jednu veličinu.";
    if (p.slike.length === 0) g.slike = "Odaberi bar jednu sliku.";

    setGreske(g);
    if (Object.keys(g).length > 0) return;
    onSacuvaj({ ...p, naziv: p.naziv.trim(), slug: p.slug.trim() });
  }

  const polje = "h-11 w-full border px-3 text-sm outline-none focus:border-cobalt";
  const okvir = (k: string) => (greske[k] ? "border-cobalt" : "border-line");

  return (
    <form onSubmit={posalji} noValidate className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-7">
        {/* Osnovno */}
        <section className="border border-line bg-white p-5">
          <h2 className="h-display-narrow mb-5 text-base">Osnovni podaci</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="naziv" className="label-tech mb-1.5 block">
                Naziv
              </label>
              <input
                id="naziv"
                value={p.naziv}
                onChange={(e) => postaviNaziv(e.target.value)}
                className={`${polje} ${okvir("naziv")}`}
              />
              {greske.naziv && (
                <p role="alert" className="mt-1.5 text-xs text-cobalt">
                  {greske.naziv}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="slug" className="label-tech mb-1.5 block">
                Slug (adresa proizvoda)
              </label>
              <input
                id="slug"
                value={p.slug}
                onChange={(e) => {
                  setSlugRucno(true);
                  postavi("slug", e.target.value);
                }}
                className={`${polje} ${okvir("slug")} font-mono`}
              />
              <p className="mt-1.5 text-xs text-steel">
                /proizvod/{p.slug || "…"}
              </p>
              {greske.slug && (
                <p role="alert" className="mt-1 text-xs text-cobalt">
                  {greske.slug}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="kategorija" className="label-tech mb-1.5 block">
                Kategorija
              </label>
              <select
                id="kategorija"
                value={p.kategorija}
                onChange={(e) =>
                  postavi("kategorija", e.target.value as Kategorija)
                }
                className={`${polje} border-line bg-white`}
              >
                {KATEGORIJE.map((k) => (
                  <option key={k.slug} value={k.slug}>
                    {k.naziv}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="boja" className="label-tech mb-1.5 block">
                Boja
              </label>
              <input
                id="boja"
                value={p.boja}
                onChange={(e) => postavi("boja", e.target.value)}
                placeholder="npr. Crna"
                className={`${polje} border-line`}
              />
            </div>

            <div>
              <label htmlFor="cijena" className="label-tech mb-1.5 block">
                Cijena (KM)
              </label>
              <input
                id="cijena"
                type="number"
                min={0}
                step={1}
                value={p.cijena || ""}
                onChange={(e) => postavi("cijena", Number(e.target.value))}
                className={`${polje} ${okvir("cijena")}`}
              />
              {greske.cijena && (
                <p role="alert" className="mt-1.5 text-xs text-cobalt">
                  {greske.cijena}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="staraCijena" className="label-tech mb-1.5 block">
                Stara cijena (prazno = bez sniženja)
              </label>
              <input
                id="staraCijena"
                type="number"
                min={0}
                step={1}
                value={p.staraCijena ?? ""}
                onChange={(e) =>
                  setP((prev) => ({
                    ...prev,
                    staraCijena: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
                className={`${polje} ${okvir("staraCijena")}`}
              />
              {greske.staraCijena && (
                <p role="alert" className="mt-1.5 text-xs text-cobalt">
                  {greske.staraCijena}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Veličine */}
        <section className="border border-line bg-white p-5">
          <h2 className="h-display-narrow mb-1 text-base">Veličine</h2>
          <p className="mb-4 text-xs text-steel">
            Odaberi one koje su dostupne za ovaj proizvod.
          </p>
          <div className="flex flex-wrap gap-2">
            {SVE_VELICINE.map((v) => {
              const odabrana = p.velicine.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleVelicina(v)}
                  aria-pressed={odabrana}
                  className={`h-10 min-w-12 border px-2.5 text-xs font-semibold transition-colors ${
                    odabrana
                      ? "border-cobalt bg-cobalt text-white"
                      : "border-line text-steel hover:border-ink hover:text-ink"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
          {greske.velicine && (
            <p role="alert" className="mt-3 text-xs text-cobalt">
              {greske.velicine}
            </p>
          )}
        </section>

        {/* Slike */}
        <section className="border border-line bg-white p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="h-display-narrow text-base">Slike</h2>
              <p className="mt-1 text-xs text-steel">
                Prva odabrana je glavna. Druga se prikazuje na hover.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBiracSlika((v) => !v)}
              className="flex shrink-0 items-center gap-1.5 border border-line px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] hover:border-ink"
            >
              <IconPlus className="h-4 w-4" />
              {biracSlika ? "Zatvori" : "Odaberi"}
            </button>
          </div>

          {p.slike.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {p.slike.map((s, i) => (
                <div key={s} className="relative">
                  <div className="relative h-24 w-[72px] overflow-hidden border border-line bg-smoke">
                    <Image src={s} alt="" aria-hidden fill sizes="72px" className="object-cover" />
                  </div>
                  {i === 0 && (
                    <span className="absolute left-0 top-0 bg-cobalt px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                      Glavna
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleSlika(s)}
                    aria-label="Ukloni sliku"
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center bg-ink text-white"
                  >
                    <IconClose className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {biracSlika && (
            <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto border border-line p-2 sm:grid-cols-6">
              {DOSTUPNE_SLIKE.map((s) => {
                const odabrana = p.slike.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSlika(s)}
                    aria-pressed={odabrana}
                    className={`relative aspect-[3/4] overflow-hidden border-2 bg-smoke ${
                      odabrana ? "border-cobalt" : "border-transparent"
                    }`}
                  >
                    <Image src={s} alt="" aria-hidden fill sizes="80px" className="object-cover" />
                    {odabrana && (
                      <span className="absolute inset-0 flex items-center justify-center bg-cobalt/70 text-white">
                        <IconCheck className="h-5 w-5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {greske.slike && (
            <p role="alert" className="mt-3 text-xs text-cobalt">
              {greske.slike}
            </p>
          )}
        </section>

        {/* Tekstovi */}
        <section className="border border-line bg-white p-5">
          <h2 className="h-display-narrow mb-5 text-base">Opis</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="opis" className="label-tech mb-1.5 block">
                Opis proizvoda
              </label>
              <textarea
                id="opis"
                rows={4}
                value={p.opis}
                onChange={(e) => postavi("opis", e.target.value)}
                className="w-full border border-line p-3 text-sm leading-relaxed outline-none focus:border-cobalt"
              />
            </div>
            <div>
              <label htmlFor="materijal" className="label-tech mb-1.5 block">
                Materijal
              </label>
              <input
                id="materijal"
                value={p.materijal}
                onChange={(e) => postavi("materijal", e.target.value)}
                placeholder="npr. 100% pamuk — 240 g/m²"
                className={`${polje} border-line`}
              />
            </div>
            <div>
              <label htmlFor="odrzavanje" className="label-tech mb-1.5 block">
                Održavanje
              </label>
              <input
                id="odrzavanje"
                value={p.odrzavanje}
                onChange={(e) => postavi("odrzavanje", e.target.value)}
                placeholder="npr. Pranje na 30°C, ne izbjeljivati."
                className={`${polje} border-line`}
              />
            </div>
          </div>
        </section>

        {/* Oznake */}
        <section className="border border-line bg-white p-5">
          <h2 className="h-display-narrow mb-4 text-base">Oznake</h2>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={Boolean(p.novo)}
                onChange={(e) => postavi("novo", e.target.checked)}
                className="accent-cobalt"
              />
              Novo — prikazuje badge i ulazi u „Novi drop”
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={Boolean(p.istaknuto)}
                onChange={(e) => postavi("istaknuto", e.target.checked)}
                className="accent-cobalt"
              />
              Istaknuto — kandidat za naslovnicu
            </label>
          </div>
        </section>
      </div>

      {/* Pretpregled + spremanje */}
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="border border-line bg-white p-5">
          <p className="label-tech mb-4">Pretpregled</p>

          <div className="relative aspect-[3/4] overflow-hidden bg-smoke">
            {p.slike[0] ? (
              <Image src={p.slike[0]} alt="" aria-hidden fill sizes="260px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-xs text-steel">
                bez slike
              </span>
            )}
            <div className="absolute left-0 top-0 flex flex-col items-start gap-px">
              {p.novo && (
                <span className="bg-cobalt px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  Novo
                </span>
              )}
              {p.staraCijena && p.staraCijena > p.cijena && (
                <span className="bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  −{popustPosto(p.cijena, p.staraCijena)}%
                </span>
              )}
            </div>
          </div>

          <p className="label-tech mt-3">{nazivKategorije(p.kategorija)}</p>
          <p className="mt-1 text-sm font-semibold">
            {p.naziv || "Naziv proizvoda"}
          </p>
          <p className="mt-1 flex items-baseline gap-2 text-sm">
            <span className={p.staraCijena ? "font-semibold text-cobalt" : "font-semibold"}>
              {cijenaKM(p.cijena || 0)}
            </span>
            {p.staraCijena && (
              <span className="text-xs text-steel line-through">
                {cijenaKM(p.staraCijena)}
              </span>
            )}
          </p>

          <button type="submit" className="btn btn-primary mt-6 w-full">
            {tekstDugmeta}
          </button>
        </div>
      </aside>
    </form>
  );
}
