"use client";

import Link from "next/link";
import { useAdmin } from "@/lib/admin/store";
import { cijenaKM, datumKratko } from "@/lib/format";
import StatKartica from "@/components/admin/StatKartica";
import StatusZnak from "@/components/admin/StatusZnak";
import { IconArrowRight, IconPlus } from "@/components/Icons";

export default function AdminPloca() {
  const { proizvodi, narudzbe, spremno } = useAdmin();

  if (!spremno) return <div className="min-h-[50vh]" />;

  const naSnizenju = proizvodi.filter((p) => p.staraCijena).length;
  const promet = narudzbe
    .filter((n) => n.status !== "otkazana")
    .reduce((s, n) => s + n.ukupno, 0);
  const nove = narudzbe.filter((n) => n.status === "nova").length;

  const zadnje = [...narudzbe]
    .sort((a, b) => +new Date(b.datum) - +new Date(a.datum))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tech label-tech-cobalt mb-2">Pregled</p>
          <h1 className="h-display text-[clamp(1.75rem,5vw,2.75rem)]">
            Nadzorna ploča
          </h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/proizvodi/novi" className="btn btn-primary">
            <IconPlus className="h-4 w-4" />
            Novi proizvod
          </Link>
          <Link href="/admin/narudzbe" className="btn btn-ghost-dark">
            Sve narudžbe
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatKartica
          oznaka="Proizvoda"
          vrijednost={String(proizvodi.length)}
          napomena={`${naSnizenju} na sniženju`}
        />
        <StatKartica
          oznaka="Narudžbi"
          vrijednost={String(narudzbe.length)}
          napomena={nove > 0 ? `${nove} nepregledanih` : "sve pregledane"}
        />
        <StatKartica
          oznaka="Promet"
          vrijednost={cijenaKM(promet)}
          napomena="bez otkazanih"
        />
        <StatKartica
          oznaka="Prosječna narudžba"
          vrijednost={
            narudzbe.length > 0
              ? cijenaKM(Math.round(promet / narudzbe.length))
              : "—"
          }
          napomena="po narudžbi"
        />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="h-display-narrow text-lg">Zadnje narudžbe</h2>
          <Link
            href="/admin/narudzbe"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:text-cobalt"
          >
            Sve
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {zadnje.length === 0 ? (
          <p className="border border-line bg-white px-5 py-10 text-center text-sm text-steel">
            Još nema narudžbi.
          </p>
        ) : (
          <div className="border border-line bg-white">
            {/* Desktop */}
            <table className="hidden w-full text-sm sm:table">
              <thead>
                <tr className="border-b border-line">
                  <th className="label-tech px-4 py-3 text-left">Broj</th>
                  <th className="label-tech px-4 py-3 text-left">Kupac</th>
                  <th className="label-tech px-4 py-3 text-left">Datum</th>
                  <th className="label-tech px-4 py-3 text-left">Status</th>
                  <th className="label-tech px-4 py-3 text-right">Iznos</th>
                </tr>
              </thead>
              <tbody>
                {zadnje.map((n) => (
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
                    <td className="px-4 py-3 text-steel">
                      {datumKratko(n.datum)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusZnak status={n.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {cijenaKM(n.ukupno)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobitel */}
            <ul className="sm:hidden">
              {zadnje.map((n) => (
                <li key={n.id} className="border-b border-line last:border-0">
                  <Link
                    href={`/admin/narudzbe/${n.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3.5"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {n.id}
                      </span>
                      <span className="block truncate text-xs text-steel">
                        {n.kupac.ime} {n.kupac.prezime} ·{" "}
                        {datumKratko(n.datum)}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-sm font-semibold">
                        {cijenaKM(n.ukupno)}
                      </span>
                      <StatusZnak status={n.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
