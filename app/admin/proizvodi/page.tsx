"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { KATEGORIJE, nazivKategorije } from "@/lib/products";
import { cijenaKM, normalizuj, popustPosto } from "@/lib/format";
import type { Kategorija, Product } from "@/lib/types";
import PraznoStanje from "@/components/admin/PraznoStanje";
import Potvrda from "@/components/admin/Potvrda";
import { IconBox, IconPencil, IconPlus, IconTrash } from "@/components/Icons";

export default function AdminProizvodi() {
  const { proizvodi, obrisiProizvod, spremno } = useAdmin();
  const [upit, setUpit] = useState("");
  const [kategorija, setKategorija] = useState<Kategorija | "">("");
  const [zaBrisanje, setZaBrisanje] = useState<Product | null>(null);

  const filtrirani = useMemo(() => {
    const q = normalizuj(upit.trim());
    return proizvodi.filter((p) => {
      if (kategorija && p.kategorija !== kategorija) return false;
      if (!q) return true;
      return normalizuj(`${p.naziv} ${p.slug} ${nazivKategorije(p.kategorija)}`)
        .includes(q);
    });
  }, [proizvodi, upit, kategorija]);

  const imaFiltera = Boolean(upit.trim() || kategorija);

  if (!spremno) return <div className="min-h-[50vh]" />;

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tech label-tech-cobalt mb-2">Katalog</p>
          <h1 className="h-display text-[clamp(1.75rem,5vw,2.75rem)]">
            Proizvodi
            <span className="ml-3 align-middle text-sm font-medium text-steel">
              {proizvodi.length}
            </span>
          </h1>
        </div>
        <Link href="/admin/proizvodi/novi" className="btn btn-primary">
          <IconPlus className="h-4 w-4" />
          Novi proizvod
        </Link>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={upit}
          onChange={(e) => setUpit(e.target.value)}
          placeholder="Pretraži po nazivu ili slugu…"
          aria-label="Pretraži proizvode"
          className="h-11 w-full border border-line bg-white px-3 text-sm outline-none focus:border-cobalt sm:max-w-xs"
        />
        <select
          value={kategorija}
          onChange={(e) => setKategorija(e.target.value as Kategorija | "")}
          aria-label="Filtriraj po kategoriji"
          className="h-11 border border-line bg-white px-3 text-sm outline-none focus:border-cobalt"
        >
          <option value="">Sve kategorije</option>
          {KATEGORIJE.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.naziv}
            </option>
          ))}
        </select>
        {imaFiltera && (
          <button
            type="button"
            onClick={() => {
              setUpit("");
              setKategorija("");
            }}
            className="h-11 px-3 text-xs font-semibold uppercase tracking-[0.1em] text-steel hover:text-ink"
          >
            Poništi
          </button>
        )}
      </div>

      {filtrirani.length === 0 ? (
        <PraznoStanje
          ikona={<IconBox className="h-12 w-12" strokeWidth={1.1} />}
          naslov={imaFiltera ? "Nema rezultata" : "Katalog je prazan"}
          opis={
            imaFiltera
              ? "Nijedan proizvod ne odgovara pretrazi ili odabranoj kategoriji."
              : "Dodaj prvi proizvod da se pojavi u katalogu."
          }
          akcija={
            imaFiltera ? (
              <button
                type="button"
                onClick={() => {
                  setUpit("");
                  setKategorija("");
                }}
                className="btn btn-dark"
              >
                Poništi filtere
              </button>
            ) : (
              <Link href="/admin/proizvodi/novi" className="btn btn-primary">
                Novi proizvod
              </Link>
            )
          }
        />
      ) : (
        <>
          <p className="label-tech mb-3">
            {filtrirani.length}{" "}
            {filtrirani.length === 1 ? "proizvod" : "proizvoda"}
          </p>

          {/* Tabela — desktop */}
          <div className="hidden border border-line bg-white lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="label-tech px-4 py-3 text-left">Proizvod</th>
                  <th className="label-tech px-4 py-3 text-left">Kategorija</th>
                  <th className="label-tech px-4 py-3 text-left">Cijena</th>
                  <th className="label-tech px-4 py-3 text-left">Veličine</th>
                  <th className="label-tech px-4 py-3 text-left">Oznake</th>
                  <th className="label-tech px-4 py-3 text-right">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {filtrirani.map((p) => (
                  <tr
                    key={p.slug}
                    className="border-b border-line last:border-0 hover:bg-smoke"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-[53px] w-10 shrink-0 overflow-hidden bg-smoke">
                          {p.slike[0] && (
                            <Image
                              src={p.slike[0]}
                              alt=""
                              aria-hidden
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/proizvodi/${p.slug}`}
                            className="block font-semibold hover:text-cobalt"
                          >
                            {p.naziv}
                          </Link>
                          <span className="text-xs text-steel">{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-steel">
                      {nazivKategorije(p.kategorija)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={p.staraCijena ? "font-semibold text-cobalt" : ""}
                      >
                        {cijenaKM(p.cijena)}
                      </span>
                      {p.staraCijena && (
                        <span className="ml-2 text-xs text-steel line-through">
                          {cijenaKM(p.staraCijena)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-steel">
                      {p.velicine.join(" · ")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.novo && (
                          <span className="bg-cobalt px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                            Novo
                          </span>
                        )}
                        {p.istaknuto && (
                          <span className="bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                            Istaknuto
                          </span>
                        )}
                        {p.staraCijena && (
                          <span className="border border-line px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-steel">
                            −{popustPosto(p.cijena, p.staraCijena)}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/proizvodi/${p.slug}`}
                          aria-label={`Uredi ${p.naziv}`}
                          className="flex h-9 w-9 items-center justify-center text-steel hover:text-cobalt"
                        >
                          <IconPencil className="h-[18px] w-[18px]" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setZaBrisanje(p)}
                          aria-label={`Obriši ${p.naziv}`}
                          className="flex h-9 w-9 items-center justify-center text-steel hover:text-cobalt"
                        >
                          <IconTrash className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartice — mobitel i tablet */}
          <ul className="grid gap-3 lg:hidden">
            {filtrirani.map((p) => (
              <li
                key={p.slug}
                className="flex gap-3 border border-line bg-white p-3"
              >
                <div className="relative h-[93px] w-[70px] shrink-0 overflow-hidden bg-smoke">
                  {p.slike[0] && (
                    <Image
                      src={p.slike[0]}
                      alt=""
                      aria-hidden
                      fill
                      sizes="70px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="label-tech">{nazivKategorije(p.kategorija)}</p>
                  <Link
                    href={`/admin/proizvodi/${p.slug}`}
                    className="mt-0.5 font-semibold leading-snug hover:text-cobalt"
                  >
                    {p.naziv}
                  </Link>
                  <p className="mt-1 text-sm">
                    <span
                      className={p.staraCijena ? "font-semibold text-cobalt" : ""}
                    >
                      {cijenaKM(p.cijena)}
                    </span>
                    {p.staraCijena && (
                      <span className="ml-2 text-xs text-steel line-through">
                        {cijenaKM(p.staraCijena)}
                      </span>
                    )}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.novo && (
                      <span className="bg-cobalt px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                        Novo
                      </span>
                    )}
                    {p.istaknuto && (
                      <span className="bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                        Istaknuto
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center gap-1 pt-2">
                    <Link
                      href={`/admin/proizvodi/${p.slug}`}
                      className="flex h-9 items-center gap-1.5 pr-3 text-xs font-semibold uppercase tracking-[0.1em] hover:text-cobalt"
                    >
                      <IconPencil className="h-4 w-4" />
                      Uredi
                    </Link>
                    <button
                      type="button"
                      onClick={() => setZaBrisanje(p)}
                      className="flex h-9 items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-[0.1em] text-steel hover:text-cobalt"
                    >
                      <IconTrash className="h-4 w-4" />
                      Obriši
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {zaBrisanje && (
        <Potvrda
          naslov="Obrisati proizvod?"
          opis={`„${zaBrisanje.naziv}” će biti uklonjen iz kataloga. Ovo se ne može poništiti.`}
          onPotvrdi={() => {
            obrisiProizvod(zaBrisanje.slug);
            setZaBrisanje(null);
          }}
          onOdustani={() => setZaBrisanje(null)}
        />
      )}
    </div>
  );
}
