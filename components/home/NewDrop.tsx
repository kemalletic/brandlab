import Link from "next/link";
import { noviProizvodi } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export default function NewDrop() {
  const proizvodi = noviProizvodi().slice(0, 4);

  return (
    <section className="border-y border-line bg-smoke py-20 sm:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="label-tech label-tech-cobalt mb-2">
                Novi drop — 08 / 26
              </p>
              <h2 className="h-display text-[clamp(1.75rem,5vw,3.5rem)]">
                Upravo stiglo
              </h2>
            </div>
            <Link
              href="/shop"
              className="link-sweep text-xs font-semibold uppercase tracking-[0.1em]"
            >
              Pogledaj sve →
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {proizvodi.map((p) => (
              <ProductCard key={p.slug} proizvod={p} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
