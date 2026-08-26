"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin/store";
import ProizvodForma from "@/components/admin/ProizvodForma";
import { IconArrowLeft } from "@/components/Icons";
import type { Product } from "@/lib/types";

export default function NoviProizvod() {
  const router = useRouter();
  const { dodajProizvod, spremno } = useAdmin();

  if (!spremno) return <div className="min-h-[50vh]" />;

  function sacuvaj(p: Product) {
    dodajProizvod(p);
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

      <h1 className="h-display mb-8 text-[clamp(1.75rem,5vw,2.75rem)]">
        Novi proizvod
      </h1>

      <ProizvodForma onSacuvaj={sacuvaj} tekstDugmeta="Dodaj proizvod" />
    </div>
  );
}
