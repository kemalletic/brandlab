"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import {
  CIJENA_DOSTAVE,
  PRAG_BESPLATNE_DOSTAVE,
  nadjiProizvod,
} from "@/lib/products";
import { cijenaKM } from "@/lib/format";

const KORACI = ["Podaci", "Dostava", "Plaćanje"] as const;

interface Podaci {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  adresa: string;
  grad: string;
  postanski: string;
}

const PRAZNI: Podaci = {
  ime: "",
  prezime: "",
  email: "",
  telefon: "",
  adresa: "",
  grad: "",
  postanski: "",
};

const POLJA: { key: keyof Podaci; label: string; type?: string; sirina?: string }[] =
  [
    { key: "ime", label: "Ime" },
    { key: "prezime", label: "Prezime" },
    { key: "email", label: "Email", type: "email", sirina: "sm:col-span-2" },
    { key: "telefon", label: "Telefon", type: "tel", sirina: "sm:col-span-2" },
    { key: "adresa", label: "Adresa", sirina: "sm:col-span-2" },
    { key: "grad", label: "Grad" },
    { key: "postanski", label: "Poštanski broj" },
  ];

export default function NaplataClient() {
  const { cart, clearCart, hydrated } = useStore();
  const [korak, setKorak] = useState(0);
  const [podaci, setPodaci] = useState<Podaci>(PRAZNI);
  const [greske, setGreske] = useState<Partial<Record<keyof Podaci, string>>>(
    {},
  );
  const [nacinDostave, setNacinDostave] = useState<"standardna" | "brza">(
    "standardna",
  );
  const [nacinPlacanja, setNacinPlacanja] = useState<"kartica" | "pouzece">(
    "kartica",
  );
  const [brojNarudzbe, setBrojNarudzbe] = useState<string | null>(null);
  const [sazetakNarudzbe, setSazetakNarudzbe] = useState<{
    medjuzbir: number;
    dostava: number;
    ukupno: number;
  } | null>(null);

  const stavke = useMemo(
    () =>
      cart
        .map((item) => ({ item, proizvod: nadjiProizvod(item.slug) }))
        .filter((x) => x.proizvod),
    [cart],
  );

  const medjuzbir = stavke.reduce(
    (sum, { item, proizvod }) => sum + (proizvod?.cijena ?? 0) * item.kolicina,
    0,
  );
  const osnovnaDostava =
    medjuzbir >= PRAG_BESPLATNE_DOSTAVE ? 0 : CIJENA_DOSTAVE;
  const dostava = nacinDostave === "brza" ? osnovnaDostava + 8 : osnovnaDostava;
  const ukupno = medjuzbir + dostava;

  function validiraj(): boolean {
    const novi: Partial<Record<keyof Podaci, string>> = {};
    for (const { key, label } of POLJA) {
      if (!podaci[key].trim()) novi[key] = `${label} je obavezno polje.`;
    }
    if (podaci.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(podaci.email))
      novi.email = "Email adresa nije ispravna.";
    setGreske(novi);
    return Object.keys(novi).length === 0;
  }

  function dalje(e: FormEvent) {
    e.preventDefault();
    if (korak === 0 && !validiraj()) return;
    setKorak((k) => k + 1);
  }

  function posalji(e: FormEvent) {
    e.preventDefault();
    const broj = `BL-${Math.floor(100000 + Math.random() * 900000)}`;
    setSazetakNarudzbe({ medjuzbir, dostava, ukupno });
    setBrojNarudzbe(broj);
    clearCart();
  }

  if (!hydrated) return <div className="min-h-[60vh]" />;

  // ── Potvrda ──
  if (brojNarudzbe) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <p className="label-tech label-tech-cobalt mb-4">Narudžba primljena</p>
        <h1 className="h-display text-[clamp(2rem,7vw,4rem)]">Hvala!</h1>
        <p className="mt-5 text-sm leading-relaxed text-steel">
          Tvoja narudžba <strong className="text-ink">{brojNarudzbe}</strong> je
          zabilježena. Potvrdu smo poslali na{" "}
          <strong className="text-ink">{podaci.email}</strong>.
        </p>
        <div className="mt-8 border border-line px-6 py-5 text-left">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-steel">Dostava na</dt>
              <dd className="text-right">
                {podaci.adresa}, {podaci.postanski} {podaci.grad}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">Način dostave</dt>
              <dd>{nacinDostave === "brza" ? "Brza (24h)" : "Standardna (48h)"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">Plaćanje</dt>
              <dd>{nacinPlacanja === "pouzece" ? "Pouzećem" : "Karticom"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">Međuzbir</dt>
              <dd>{cijenaKM(sazetakNarudzbe?.medjuzbir ?? 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">Dostava</dt>
              <dd>
                {sazetakNarudzbe?.dostava === 0
                  ? "Besplatno"
                  : cijenaKM(sazetakNarudzbe?.dostava ?? 0)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2.5 font-bold">
              <dt>Ukupno</dt>
              <dd>{cijenaKM(sazetakNarudzbe?.ukupno ?? 0)}</dd>
            </div>
          </dl>
        </div>
        <p className="mt-6 text-xs text-steel">
          Ovo je demo prodavnica — narudžba nije naplaćena.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Nastavi kupovinu
        </Link>
      </div>
    );
  }

  // ── Prazna korpa ──
  if (stavke.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <h1 className="h-display mb-3 text-[clamp(1.75rem,6vw,3rem)]">
          Korpa je prazna
        </h1>
        <p className="mb-8 text-sm text-steel">
          Dodaj nešto u korpu prije naplate.
        </p>
        <Link href="/shop" className="btn btn-primary">
          Idi u shop
        </Link>
      </div>
    );
  }

  const inputKlasa =
    "h-12 w-full border border-line px-3 text-sm outline-none focus:border-cobalt";

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="h-display mb-8 text-[clamp(2rem,6vw,3.5rem)]">Naplata</h1>

      {/* Koraci */}
      <ol className="mb-10 flex gap-2 border-b border-line pb-4">
        {KORACI.map((k, i) => (
          <li key={k} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center text-[11px] font-bold ${
                i <= korak ? "bg-cobalt text-white" : "bg-smoke text-steel"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                i <= korak ? "text-ink" : "text-steel"
              }`}
            >
              {k}
            </span>
            {i < KORACI.length - 1 && (
              <span className="mx-2 text-line">—</span>
            )}
          </li>
        ))}
      </ol>

      <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
        <div>
          {korak === 0 && (
            <form onSubmit={dalje} noValidate>
              <h2 className="h-display-narrow mb-5 text-lg">Tvoji podaci</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {POLJA.map((f) => (
                  <div key={f.key} className={f.sirina}>
                    <label
                      htmlFor={f.key}
                      className="label-tech mb-1.5 block"
                    >
                      {f.label}
                    </label>
                    <input
                      id={f.key}
                      type={f.type ?? "text"}
                      value={podaci[f.key]}
                      onChange={(e) =>
                        setPodaci({ ...podaci, [f.key]: e.target.value })
                      }
                      aria-invalid={Boolean(greske[f.key])}
                      className={`${inputKlasa} ${
                        greske[f.key] ? "border-cobalt" : ""
                      }`}
                    />
                    {greske[f.key] && (
                      <p role="alert" className="mt-1 text-xs text-cobalt">
                        {greske[f.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <button type="submit" className="btn btn-primary mt-8">
                Nastavi na dostavu
              </button>
            </form>
          )}

          {korak === 1 && (
            <form onSubmit={dalje}>
              <h2 className="h-display-narrow mb-5 text-lg">Način dostave</h2>
              <div className="space-y-3">
                {[
                  {
                    id: "standardna" as const,
                    naslov: "Standardna dostava",
                    opis: "Isporuka za 48 sati",
                    cijena: osnovnaDostava,
                  },
                  {
                    id: "brza" as const,
                    naslov: "Brza dostava",
                    opis: "Isporuka sljedeći radni dan",
                    cijena: osnovnaDostava + 8,
                  },
                ].map((o) => (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer items-center justify-between border p-4 transition-colors ${
                      nacinDostave === o.id
                        ? "border-cobalt bg-cobalt/[0.03]"
                        : "border-line hover:border-ink"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="dostava"
                        checked={nacinDostave === o.id}
                        onChange={() => setNacinDostave(o.id)}
                        className="accent-cobalt"
                      />
                      <span>
                        <span className="block text-sm font-semibold">
                          {o.naslov}
                        </span>
                        <span className="block text-xs text-steel">
                          {o.opis}
                        </span>
                      </span>
                    </span>
                    <span className="text-sm font-semibold">
                      {o.cijena === 0 ? "Besplatno" : cijenaKM(o.cijena)}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setKorak(0)}
                  className="btn btn-ghost-dark"
                >
                  Nazad
                </button>
                <button type="submit" className="btn btn-primary">
                  Nastavi na plaćanje
                </button>
              </div>
            </form>
          )}

          {korak === 2 && (
            <form onSubmit={posalji}>
              <h2 className="h-display-narrow mb-5 text-lg">Plaćanje</h2>
              <div className="space-y-3">
                {[
                  { id: "kartica" as const, naslov: "Kartica", opis: "Visa, Mastercard, Maestro" },
                  { id: "pouzece" as const, naslov: "Pouzećem", opis: "Plaćanje kuriru pri preuzimanju" },
                ].map((o) => (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer items-center gap-3 border p-4 transition-colors ${
                      nacinPlacanja === o.id
                        ? "border-cobalt bg-cobalt/[0.03]"
                        : "border-line hover:border-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="placanje"
                      checked={nacinPlacanja === o.id}
                      onChange={() => setNacinPlacanja(o.id)}
                      className="accent-cobalt"
                    />
                    <span>
                      <span className="block text-sm font-semibold">
                        {o.naslov}
                      </span>
                      <span className="block text-xs text-steel">{o.opis}</span>
                    </span>
                  </label>
                ))}
              </div>

              {nacinPlacanja === "kartica" && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="kartica-broj" className="label-tech mb-1.5 block">
                      Broj kartice
                    </label>
                    <input
                      id="kartica-broj"
                      required
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      className={inputKlasa}
                    />
                  </div>
                  <div>
                    <label htmlFor="kartica-rok" className="label-tech mb-1.5 block">
                      Vrijedi do
                    </label>
                    <input
                      id="kartica-rok"
                      required
                      placeholder="MM/GG"
                      className={inputKlasa}
                    />
                  </div>
                  <div>
                    <label htmlFor="kartica-cvv" className="label-tech mb-1.5 block">
                      CVV
                    </label>
                    <input
                      id="kartica-cvv"
                      required
                      inputMode="numeric"
                      placeholder="000"
                      className={inputKlasa}
                    />
                  </div>
                </div>
              )}

              <p className="mt-5 border-l-2 border-cobalt bg-smoke px-4 py-3 text-xs text-steel">
                Demo prodavnica — podaci se ne šalju nigdje i naplata se ne
                izvršava.
              </p>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setKorak(1)}
                  className="btn btn-ghost-dark"
                >
                  Nazad
                </button>
                <button type="submit" className="btn btn-primary">
                  Potvrdi narudžbu
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line p-6">
            <h2 className="h-display-narrow mb-5 text-lg">Tvoja narudžba</h2>
            <div className="mb-5 space-y-4">
              {stavke.map(({ item, proizvod }) => (
                <div
                  key={`${item.slug}-${item.velicina}`}
                  className="flex gap-3"
                >
                  <div className="relative h-16 w-13 shrink-0 overflow-hidden bg-smoke">
                    <Image
                      src={proizvod!.slike[0]}
                      alt={proizvod!.naziv}
                      fill
                      sizes="52px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {proizvod!.naziv}
                    </p>
                    <p className="text-xs text-steel">
                      {item.velicina} · {item.kolicina} kom
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {cijenaKM(proizvod!.cijena * item.kolicina)}
                  </span>
                </div>
              ))}
            </div>

            <dl className="space-y-2.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-steel">Međuzbir</dt>
                <dd>{cijenaKM(medjuzbir)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-steel">Dostava</dt>
                <dd>{dostava === 0 ? "Besplatno" : cijenaKM(dostava)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2.5 text-base font-bold">
                <dt>Ukupno</dt>
                <dd>{cijenaKM(ukupno)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
