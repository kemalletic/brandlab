"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { nadjiProizvod } from "@/lib/products";
import { cijenaKM, datumPuni } from "@/lib/format";
import { STATUSI, type StatusNarudzbe } from "@/lib/admin/tipovi";
import StatusZnak from "@/components/admin/StatusZnak";
import PraznoStanje from "@/components/admin/PraznoStanje";
import Potvrda from "@/components/admin/Potvrda";
import { IconArrowLeft, IconReceipt, IconTrash } from "@/components/Icons";

export default function DetaljNarudzbe({
  params,
}: PageProps<"/admin/narudzbe/[id]">) {
  const { id } = use(params);
  const router = useRouter();
  const { narudzbe, postaviStatus, obrisiNarudzbu, spremno } = useAdmin();
  const [brisanje, setBrisanje] = useState(false);

  if (!spremno) return <div className="min-h-[50vh]" />;

  const n = narudzbe.find((x) => x.id === id);

  if (!n) {
    return (
      <div className="mx-auto max-w-[1400px]">
        <PraznoStanje
          ikona={<IconReceipt className="h-12 w-12" strokeWidth={1.1} />}
          naslov="Narudžba nije pronađena"
          opis={`Nema narudžbe s brojem „${id}”. Možda je obrisana.`}
          akcija={
            <Link href="/admin/narudzbe" className="btn btn-primary">
              Nazad na narudžbe
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <Link
        href="/admin/narudzbe"
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-steel hover:text-ink"
      >
        <IconArrowLeft className="h-4 w-4" />
        Narudžbe
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <p className="label-tech label-tech-cobalt">Narudžba</p>
            <StatusZnak status={n.status} />
          </div>
          <h1 className="h-display text-[clamp(1.75rem,5vw,2.75rem)]">
            {n.id}
          </h1>
          <p className="mt-2 text-sm text-steel">{datumPuni(n.datum)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2">
            <span className="label-tech">Status</span>
            <select
              value={n.status}
              onChange={(e) =>
                postaviStatus(n.id, e.target.value as StatusNarudzbe)
              }
              aria-label="Promijeni status narudžbe"
              className="h-11 border border-line bg-white px-3 text-sm outline-none focus:border-cobalt"
            >
              {STATUSI.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setBrisanje(true)}
            className="flex h-11 items-center gap-1.5 border border-line bg-white px-3 text-xs font-semibold uppercase tracking-[0.1em] text-steel hover:border-ink hover:text-ink"
          >
            <IconTrash className="h-4 w-4" />
            Obriši
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Stavke */}
        <section className="border border-line bg-white">
          <h2 className="h-display-narrow border-b border-line px-5 py-4 text-base">
            Stavke
          </h2>
          <ul>
            {n.stavke.map((st) => {
              const p = nadjiProizvod(st.slug);
              return (
                <li
                  key={`${st.slug}-${st.velicina}`}
                  className="flex gap-4 border-b border-line px-5 py-4 last:border-0"
                >
                  <div className="relative h-[93px] w-[70px] shrink-0 overflow-hidden bg-smoke">
                    {p?.slike[0] && (
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
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="font-semibold leading-snug">{st.naziv}</p>
                    <p className="mt-1 text-sm text-steel">
                      Veličina {st.velicina} · {st.kolicina} ×{" "}
                      {cijenaKM(st.cijena)}
                    </p>
                  </div>
                  <span className="self-center whitespace-nowrap font-semibold">
                    {cijenaKM(st.cijena * st.kolicina)}
                  </span>
                </li>
              );
            })}
          </ul>

          <dl className="space-y-2.5 border-t border-line px-5 py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-steel">Međuzbir</dt>
              <dd>{cijenaKM(n.medjuzbir)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">
                Dostava ({n.nacinDostave === "brza" ? "brza" : "standardna"})
              </dt>
              <dd>{n.dostava === 0 ? "Besplatno" : cijenaKM(n.dostava)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2.5 text-base font-bold">
              <dt>Ukupno</dt>
              <dd>{cijenaKM(n.ukupno)}</dd>
            </div>
          </dl>
        </section>

        {/* Kupac */}
        <aside className="space-y-6">
          <section className="border border-line bg-white p-5">
            <h2 className="h-display-narrow mb-4 text-base">Kupac</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="label-tech">Ime</dt>
                <dd className="mt-0.5">
                  {n.kupac.ime} {n.kupac.prezime}
                </dd>
              </div>
              <div>
                <dt className="label-tech">Email</dt>
                <dd className="mt-0.5 break-all">{n.kupac.email}</dd>
              </div>
              <div>
                <dt className="label-tech">Telefon</dt>
                <dd className="mt-0.5">{n.kupac.telefon}</dd>
              </div>
            </dl>
          </section>

          <section className="border border-line bg-white p-5">
            <h2 className="h-display-narrow mb-4 text-base">Dostava</h2>
            <address className="text-sm not-italic leading-relaxed">
              {n.kupac.adresa}
              <br />
              {n.kupac.postanski} {n.kupac.grad}
            </address>
            <p className="label-tech mt-4">
              Plaćanje —{" "}
              {n.nacinPlacanja === "pouzece" ? "pouzećem" : "karticom"}
            </p>
          </section>
        </aside>
      </div>

      {brisanje && (
        <Potvrda
          naslov="Obrisati narudžbu?"
          opis={`Narudžba ${n.id} će biti trajno uklonjena. Ovo se ne može poništiti.`}
          onPotvrdi={() => {
            obrisiNarudzbu(n.id);
            router.push("/admin/narudzbe");
          }}
          onOdustani={() => setBrisanje(false)}
        />
      )}
    </div>
  );
}
