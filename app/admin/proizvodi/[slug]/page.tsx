"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useAdmin } from "@/lib/admin/store";
import ProizvodForma from "@/components/admin/ProizvodForma";
import PraznoStanje from "@/components/admin/PraznoStanje";
import { IconArrowLeft, IconBox, IconExternal } from "@/components/Icons";
import type { Product } from "@/lib/types";

export default function UrediProizvod({ params }: PageProps<"/admin/proizvodi/[slug]">) {
  const { slug } = use(params);
  const router = useRouter();
  const { nadjiPoSlugu, izmijeniProizvod, spremno } = useAdmin();

  if (!spremno) return <div className="min-h-[50vh]" />;

  const proizvod = nadjiPoSlugu(slug);

  if (!proizvod) {
    return (
      <div className="mx-auto max-w-[1400px]">
        <PraznoStanje
          ikona={<IconBox className="h-12 w-12" strokeWidth={1.1} />}
          naslov="Proizvod nije pronađen"
          opis={`Nema proizvoda sa slugom „${slug}”. Možda je obrisan.`}
          akcija={
            <Link href="/admin/proizvodi" className="btn btn-primary">
              Nazad na proizvode
            </Link>
          }
        />
      </div>
    );
  }

  function sacuvaj(p: Product) {
    izmijeniProizvod(slug, p);
    router.push("/admin/proizvodi");
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <Link
        href="/admin/proizvodi"
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-steel hover:text-ink"
      >
        <IconArrowLeft className="h-4 w-4" />
        Proizvodi
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tech label-tech-cobalt mb-2">Izmjena</p>
          <h1 className="h-display text-[clamp(1.75rem,5vw,2.75rem)]">
            {proizvod.naziv}
          </h1>
        </div>
        <a
          href={`/proizvod/${proizvod.slug}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-steel hover:text-cobalt"
        >
          <IconExternal className="h-4 w-4" />
          Otvori na sajtu
        </a>
      </div>

      <ProizvodForma
        pocetni={proizvod}
        onSacuvaj={sacuvaj}
        tekstDugmeta="Sačuvaj izmjene"
      />
    </div>
  );
}
