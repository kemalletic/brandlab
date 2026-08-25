import Image from "next/image";
import Link from "next/link";
import { KATEGORIJE } from "@/lib/products";
import Reveal from "@/components/Reveal";

export default function Categories() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="label-tech label-tech-cobalt mb-2">Kategorije</p>
            <h2 className="h-display text-[clamp(1.75rem,5vw,3.5rem)]">
              Odaberi svoj komad
            </h2>
          </div>
          <Link
            href="/shop"
            className="link-sweep hidden text-xs font-semibold uppercase tracking-[0.1em] sm:block"
          >
            Sve →
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {KATEGORIJE.map((k, i) => (
          <Reveal key={k.slug} delayMs={i * 60}>
            <Link
              href={`/shop?kategorija=${k.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-smoke lg:aspect-[4/3]"
            >
              <Image
                src={k.slika}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
              <span className="h-display-narrow absolute bottom-4 left-4 text-xl text-white sm:text-2xl">
                {k.naziv}
              </span>
              <span className="absolute bottom-4 right-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
