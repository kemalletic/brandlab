import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "O nama",
  description:
    "Priča iza BRANDLAB-a — male serije, provjereni krojevi i odjeća napravljena za svakodnevno nošenje.",
};

const VRIJEDNOSTI = [
  {
    naslov: "Male serije",
    tekst:
      "Šijemo po nekoliko stotina komada po modelu. Kad se rasproda, najčešće se ne vraća — zato drop znači drop.",
  },
  {
    naslov: "Provjereno nošenjem",
    tekst:
      "Svaki uzorak nosimo mjesec dana prije nego uđe u kolekciju. Ako popusti šav ili izblijedi boja, model se vraća na početak.",
  },
  {
    naslov: "Bez viška",
    tekst:
      "Jedan detalj po komadu. Nema natrpanih logotipa ni printova koji se ljušte nakon petog pranja.",
  },
];

export default function ONamaPage() {
  return (
    <div>
      <section className="relative flex min-h-[60svh] items-end overflow-hidden bg-ink">
        <Image
          src="/products/look-06.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-14 sm:px-8 sm:pb-20">
          <p className="label-tech mb-4 text-white/60">O nama</p>
          <h1 className="h-display max-w-3xl text-white text-[clamp(2rem,8vw,6rem)]">
            Dvije mašine i jedna ideja
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <h2 className="h-display text-[clamp(1.5rem,4vw,2.75rem)]">
              Kako je počelo
            </h2>
            <div className="space-y-5 text-sm leading-relaxed text-steel">
              <p>
                BRANDLAB je 2019. počeo u podrumskoj radionici na Grbavici, sa
                dvije šivaće mašine i policom uzoraka pamuka. Prvi drop bio je
                jedan model duksa u tri boje. Rasprodao se za devet dana, a mi
                smo shvatili da u gradu postoji potreba za odjećom koja nije ni
                jeftina kopija ni preplaćen uvoz.
              </p>
              <p>
                Od tada radimo isto što i prvog dana: biramo materijal koji
                izdrži, krojimo tako da komad stoji i nakon što se opere
                dvadeset puta, i držimo serije male. Sve što izađe pod našim
                imenom prvo prođe kroz naše ormare.
              </p>
              <p>
                Danas nas je devetoro. Šivanje je i dalje u Bosni, a slike za
                kolekciju snimamo na istim ulicama gdje je sve počelo.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-smoke py-20 sm:py-28">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <Reveal>
            <p className="label-tech label-tech-cobalt mb-3">Kako radimo</p>
            <h2 className="h-display mb-12 text-[clamp(1.5rem,4vw,2.75rem)]">
              Tri pravila kojih se držimo
            </h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-3">
            {VRIJEDNOSTI.map((v, i) => (
              <Reveal key={v.naslov} delayMs={i * 80}>
                <div className="border-t-2 border-cobalt pt-5">
                  <h3 className="h-display-narrow mb-3 text-xl">{v.naslov}</h3>
                  <p className="text-sm leading-relaxed text-steel">
                    {v.tekst}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-4 sm:grid-cols-2">
          {["/products/hero-02.jpg", "/products/look-05.jpg"].map((s, i) => (
            <Reveal key={s} delayMs={i * 80}>
              <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
                <Image
                  src={s}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 text-center">
            <h2 className="h-display mb-6 text-[clamp(1.5rem,5vw,3rem)]">
              Vidimo se u novom dropu
            </h2>
            <Link href="/shop" className="btn btn-primary">
              Pogledaj kolekciju
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
