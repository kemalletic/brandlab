import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Dvodijelni raspored za prijavu i registraciju: forma lijevo, fotografija
 * desno. Na mobitelu se fotografija ne prikazuje da forma bude odmah vidljiva.
 */
export default function AuthLayout({
  eyebrow,
  naslov,
  podnaslov,
  slika,
  children,
  podnozje,
}: {
  eyebrow: string;
  naslov: string;
  podnaslov: string;
  slika: string;
  children: ReactNode;
  podnozje: ReactNode;
}) {
  return (
    <div className="grid lg:min-h-[calc(100svh-6.5rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-14 sm:px-8 sm:py-20">
        <div className="w-full max-w-sm">
          <nav className="label-tech mb-8 flex gap-2">
            <Link href="/" className="hover:text-ink">
              Početna
            </Link>
            <span>/</span>
            <span className="text-ink">{eyebrow}</span>
          </nav>

          <h1 className="h-display text-[clamp(1.875rem,5vw,2.75rem)]">
            {naslov}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-steel">{podnaslov}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 border-t border-line pt-6 text-sm text-steel">
            {podnozje}
          </div>
        </div>
      </div>

      <div className="relative hidden bg-ink lg:block">
        <Image
          src={slika}
          alt=""
          aria-hidden
          fill
          sizes="50vw"
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="label-tech mb-3 text-white/50">BRANDLAB račun</p>
          <p className="h-display text-3xl leading-tight text-white">
            Prati narudžbe,
            <br />
            čuvaj favorite
          </p>
        </div>
      </div>
    </div>
  );
}
