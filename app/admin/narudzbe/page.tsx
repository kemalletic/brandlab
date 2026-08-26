"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { cijenaKM, datumKratko } from "@/lib/format";
import { STATUSI, type StatusNarudzbe } from "@/lib/admin/tipovi";
import StatusZnak from "@/components/admin/StatusZnak";
import PraznoStanje from "@/components/admin/PraznoStanje";
import { IconReceipt } from "@/components/Icons";

export default function AdminNarudzbe() {
  const { narudzbe, spremno } = useAdmin();
  const [filter, setFilter] = useState<StatusNarudzbe | "">("");

  const sortirane = useMemo(
    () =>
      [...narudzbe].sort((a, b) => +new Date(b.datum) - +new Date(a.datum)),
    [narudzbe],
  );

  const prikazane = useMemo(
    () => (filter ? sortirane.filter((n) => n.status === filter) : sortirane),
    [sortirane, filter],
  );

  const brojac = useMemo(() => {
    const m = new Map<StatusNarudzbe, number>();
    for (const n of narudzbe) m.set(n.status, (m.get(n.status) ?? 0) + 1);
    return m;
  }, [narudzbe]);

  if (!spremno) return <div className="min-h-[50vh]" />;

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6">
        <p className="label-tech label-tech-cobalt mb-2">Prodaja</p>
        <h1 className="h-display text-[clamp(1.75rem,5vw,2.75rem)]">
          Narudžbe
          <span className="ml-3 align-middle text-sm font-medium text-steel">
            {narudzbe.length}
          </span>
        </h1>
      </div>

      {/* Filter po statusu */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("")}
          aria-pressed={filter === ""}
          className={`border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
            filter === ""
              ? "border-ink bg-ink text-white"
              : "border-line bg-white text-steel hover:border-ink hover:text-ink"
          }`}
        >
          Sve {narudzbe.length}
        </button>
        {STATUSI.map((s) => {
          const broj = brojac.get(s.value) ?? 0;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setFilter(s.value)}
              aria-pressed={filter === s.value}
              className={`border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                filter === s.value
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-steel hover:border-ink hover:text-ink"
              }`}
            >
              {s.label} {broj}
            </button>
          );
        })}
      </div>

      {prikazane.length === 0 ? (
        <PraznoStanje
          ikona={<IconReceipt className="h-12 w-12" strokeWidth={1.1} />}
          naslov={filter ? "Nema narudžbi u ovom statusu" : "Još nema narudžbi"}
          opis={
            filter
              ? "Promijeni filter da vidiš ostale narudžbe."
              : "Narudžbe s naplate pojavit će se ovdje."
          }
          akcija={
            filter ? (
              <button
                type="button"
                onClick={() => setFilter("")}
                className="btn btn-dark"
              >
                Prikaži sve
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="border border-line bg-white">
          {/* Desktop */}
          <table className="hidden w-full text-sm lg:table">
            <thead>
              <tr className="border-b border-line">
                <th className="label-tech px-4 py-3 text-left">Broj</th>
                <th className="label-tech px-4 py-3 text-left">Kupac</th>
                <th className="label-tech px-4 py-3 text-left">Grad</th>
                <th className="label-tech px-4 py-3 text-left">Datum</th>
                <th className="label-tech px-4 py-3 text-left">Komada</th>
                <th className="label-tech px-4 py-3 text-left">Status</th>
                <th className="label-tech px-4 py-3 text-right">Iznos</th>
              </tr>
            </thead>
            <tbody>
              {prikazane.map((n) => {
                const komada = n.stavke.reduce((s, st) => s + st.kolicina, 0);
                return (
                  <tr
                    key={n.id}
                    className="border-b border-line last:border-0 hover:bg-smoke"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/narudzbe/${n.id}`}
                        className="font-semibold hover:text-cobalt"
                      >
                        {n.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {n.kupac.ime} {n.kupac.prezime}
                    </td>
                    <td className="px-4 py-3 text-steel">{n.kupac.grad}</td>
                    <td className="px-4 py-3 text-steel">
                      {datumKratko(n.datum)}
                    </td>
                    <td className="px-4 py-3 text-steel">{komada}</td>
                    <td className="px-4 py-3">
                      <StatusZnak status={n.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {cijenaKM(n.ukupno)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobitel i tablet */}
          <ul className="lg:hidden">
            {prikazane.map((n) => {
              const komada = n.stavke.reduce((s, st) => s + st.kolicina, 0);
              return (
                <li key={n.id} className="border-b border-line last:border-0">
                  <Link
                    href={`/admin/narudzbe/${n.id}`}
                    className="flex items-start justify-between gap-3 px-4 py-4"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold">{n.id}</span>
                      <span className="mt-0.5 block truncate text-sm text-steel">
                        {n.kupac.ime} {n.kupac.prezime} · {n.kupac.grad}
                      </span>
                      <span className="label-tech mt-1 block">
                        {datumKratko(n.datum)} · {komada}{" "}
                        {komada === 1 ? "komad" : "komada"}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-2">
                      <span className="font-semibold">
                        {cijenaKM(n.ukupno)}
                      </span>
                      <StatusZnak status={n.status} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
