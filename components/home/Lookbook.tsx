import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function Lookbook() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <Link
          href="/shop?kategorija=jakne"
          className="group relative block aspect-[4/5] overflow-hidden bg-ink sm:aspect-[21/9]"
        >
          <Image
            src="/products/hero-01.jpg"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14">
            <p className="label-tech mb-3 text-white/60">Lookbook</p>
            <h2 className="h-display max-w-lg text-white text-[clamp(1.75rem,6vw,4.5rem)]">
              Slojevi za hladne mjesece
            </h2>
            <span className="mt-6 inline-flex w-fit items-center gap-2 border-b border-white/40 pb-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">
              Pogledaj jakne →
            </span>
          </div>
        </Link>
      </Reveal>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          {
            slika: "/products/look-05.jpg",
            naslov: "Ulica",
            tekst: "Kožne jakne i patike koje podnose kaldrmu.",
            href: "/shop?kategorija=patike",
          },
          {
            slika: "/products/majica-02.jpg",
            naslov: "Print",
            tekst: "Grafika u kobalt plavoj — jedan detalj, ništa više.",
            href: "/shop?kategorija=majice",
          },
        ].map((b, i) => (
          <Reveal key={b.naslov} delayMs={i * 80}>
            <Link
              href={b.href}
              className="group relative block aspect-[4/3] overflow-hidden bg-smoke"
            >
              <Image
                src={b.slika}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="h-display-narrow text-2xl text-white">
                  {b.naslov}
                </h3>
                <p className="mt-1 text-sm text-white/70">{b.tekst}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
