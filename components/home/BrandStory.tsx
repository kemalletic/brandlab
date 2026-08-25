import Link from "next/link";
import Reveal from "@/components/Reveal";

const BROJKE = [
  { broj: "2019", label: "Osnovan u Sarajevu" },
  { broj: "48h", label: "Dostava u BiH" },
  { broj: "30", label: "Dana za povrat" },
  { broj: "100%", label: "Pamuk u osnovnoj liniji" },
];

export default function BrandStory() {
  return (
    <section className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="label-tech mb-4 text-cobalt">Brend</p>
              <h2 className="h-display text-[clamp(1.75rem,5vw,3.5rem)]">
                Napravljeno da se nosi,
                <br />
                ne da stoji u ormaru
              </h2>
            </div>
            <div className="flex flex-col justify-center gap-5 text-sm leading-relaxed text-white/70">
              <p>
                BRANDLAB je počeo kao mala radionica sa dvije mašine i idejom
                da odjeća za grad ne mora biti ni skupa ni prenatrpana
                logotipima. Svaki komad prođe kroz nošenje prije nego što uđe
                u kolekciju — ako se ne drži nakon mjesec dana, ne ide u
                prodaju.
              </p>
              <p>
                Radimo u malim serijama. Ono što je rasprodano najčešće se ne
                vraća — zato drop znači drop.
              </p>
              <Link
                href="/o-nama"
                className="link-sweep w-fit text-xs font-semibold uppercase tracking-[0.1em] text-white"
              >
                Cijela priča →
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-px border-t border-white/10 pt-px lg:grid-cols-4">
          {BROJKE.map((b, i) => (
            <Reveal key={b.label} delayMs={i * 60}>
              <div className="py-8">
                <p className="h-display text-[clamp(2rem,6vw,4rem)] leading-none">
                  {b.broj}
                </p>
                <p className="label-tech mt-2 text-white/40">{b.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
