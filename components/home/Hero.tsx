import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative -mt-16 flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
      <Image
        src="/products/look-08.jpg"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-14 pt-28 sm:px-8 sm:pb-20">
        <p className="label-tech mb-5 text-white/60">
          Kolekcija — Jesen / Zima 26
        </p>

        <h1 className="h-display text-white text-[clamp(2.75rem,11vw,9rem)]">
          <span className="hero-line">
            <span style={{ animationDelay: "80ms" }}>Grad je</span>
          </span>
          <span className="hero-line">
            <span style={{ animationDelay: "180ms" }} className="text-cobalt">
              tvoj teren
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/shop" className="btn btn-primary">
            Kupuj sada
          </Link>
          <Link href="/o-nama" className="btn btn-ghost-light">
            Priča brenda
          </Link>
        </div>

        <p className="mt-10 max-w-md text-sm leading-relaxed text-white/60">
          Odjeća napravljena da izdrži sedam dana u sedmici — bez printova
          koji viču i krojeva koji se raspadnu nakon trećeg pranja.
        </p>
      </div>
    </section>
  );
}
