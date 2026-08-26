"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { cijenaKM } from "@/lib/format";
import type { Postavke } from "@/lib/admin/tipovi";
import Potvrda from "@/components/admin/Potvrda";
import { IconAlert, IconClose, IconPlus } from "@/components/Icons";

export default function AdminPostavke() {
  const { postavke, spremno } = useAdmin();
  // Forma se montira tek kad podaci stignu — tako useState uzme stvarne
  // vrijednosti kao početne, bez sinhronizacije kroz efekt.
  if (!spremno) return <div className="min-h-[50vh]" />;
  return <PostavkeForma pocetne={postavke} />;
}

function PostavkeForma({ pocetne }: { pocetne: Postavke }) {
  const { izmijeniPostavke, resetuj } = useAdmin();
  const [nacrt, setNacrt] = useState<Postavke>(pocetne);
  const [greske, setGreske] = useState<Partial<Record<string, string>>>({});
  const [reset, setReset] = useState(false);

  function broj(k: keyof Postavke, v: string) {
    setNacrt((p) => ({ ...p, [k]: v === "" ? 0 : Number(v) }));
    setGreske((g) => ({ ...g, [k]: undefined }));
  }

  function sacuvaj(e: React.FormEvent) {
    e.preventDefault();
    const g: Partial<Record<string, string>> = {};
    if (nacrt.pragBesplatneDostave < 0)
      g.pragBesplatneDostave = "Ne može biti manje od nule.";
    if (nacrt.cijenaDostave < 0) g.cijenaDostave = "Ne može biti manje od nule.";
    if (nacrt.doplataBrzaDostava < 0)
      g.doplataBrzaDostava = "Ne može biti manje od nule.";
    const poruke = nacrt.tickerPoruke.map((p) => p.trim()).filter(Boolean);
    if (poruke.length === 0) g.ticker = "Ostavi bar jednu poruku.";

    setGreske(g);
    if (Object.keys(g).length > 0) return;
    izmijeniPostavke({ ...nacrt, tickerPoruke: poruke });
  }

  const polje = "h-11 w-full border px-3 text-sm outline-none focus:border-cobalt";
  const okvir = (k: string) => (greske[k] ? "border-cobalt" : "border-line");

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="mb-8">
        <p className="label-tech label-tech-cobalt mb-2">Prodavnica</p>
        <h1 className="h-display text-[clamp(1.75rem,5vw,2.75rem)]">
          Postavke
        </h1>
      </div>

      <form onSubmit={sacuvaj} noValidate className="space-y-6">
        <section className="border border-line bg-white p-5">
          <h2 className="h-display-narrow mb-1 text-base">Dostava</h2>
          <p className="mb-5 text-xs text-steel">
            Iznosi se primjenjuju na naplati i u korpi.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="prag" className="label-tech mb-1.5 block">
                Besplatno iznad (KM)
              </label>
              <input
                id="prag"
                type="number"
                min={0}
                value={nacrt.pragBesplatneDostave}
                onChange={(e) => broj("pragBesplatneDostave", e.target.value)}
                className={`${polje} ${okvir("pragBesplatneDostave")}`}
              />
              {greske.pragBesplatneDostave && (
                <p role="alert" className="mt-1.5 text-xs text-cobalt">
                  {greske.pragBesplatneDostave}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cijena" className="label-tech mb-1.5 block">
                Cijena dostave (KM)
              </label>
              <input
                id="cijena"
                type="number"
                min={0}
                value={nacrt.cijenaDostave}
                onChange={(e) => broj("cijenaDostave", e.target.value)}
                className={`${polje} ${okvir("cijenaDostave")}`}
              />
              {greske.cijenaDostave && (
                <p role="alert" className="mt-1.5 text-xs text-cobalt">
                  {greske.cijenaDostave}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="brza" className="label-tech mb-1.5 block">
                Doplata za brzu (KM)
              </label>
              <input
                id="brza"
                type="number"
                min={0}
                value={nacrt.doplataBrzaDostava}
                onChange={(e) => broj("doplataBrzaDostava", e.target.value)}
                className={`${polje} ${okvir("doplataBrzaDostava")}`}
              />
              {greske.doplataBrzaDostava && (
                <p role="alert" className="mt-1.5 text-xs text-cobalt">
                  {greske.doplataBrzaDostava}
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 bg-smoke px-4 py-3 text-xs leading-relaxed text-steel">
            Narudžba ispod {cijenaKM(nacrt.pragBesplatneDostave)} plaća{" "}
            {cijenaKM(nacrt.cijenaDostave)} dostave; brza dostava dodaje{" "}
            {cijenaKM(nacrt.doplataBrzaDostava)}.
          </p>
        </section>

        <section className="border border-line bg-white p-5">
          <h2 className="h-display-narrow mb-1 text-base">Traka na vrhu</h2>
          <p className="mb-5 text-xs text-steel">
            Poruke koje se vrte u plavoj traci iznad zaglavlja.
          </p>

          <div className="space-y-2.5">
            {nacrt.tickerPoruke.map((poruka, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={poruka}
                  onChange={(e) =>
                    setNacrt((p) => ({
                      ...p,
                      tickerPoruke: p.tickerPoruke.map((x, j) =>
                        j === i ? e.target.value : x,
                      ),
                    }))
                  }
                  aria-label={`Poruka ${i + 1}`}
                  className={`${polje} border-line`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setNacrt((p) => ({
                      ...p,
                      tickerPoruke: p.tickerPoruke.filter((_, j) => j !== i),
                    }))
                  }
                  aria-label={`Ukloni poruku ${i + 1}`}
                  disabled={nacrt.tickerPoruke.length === 1}
                  className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-steel hover:border-ink hover:text-ink disabled:opacity-40"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {greske.ticker && (
            <p role="alert" className="mt-2 text-xs text-cobalt">
              {greske.ticker}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              setNacrt((p) => ({ ...p, tickerPoruke: [...p.tickerPoruke, ""] }))
            }
            className="mt-3 flex items-center gap-1.5 border border-line px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] hover:border-ink"
          >
            <IconPlus className="h-4 w-4" />
            Dodaj poruku
          </button>
        </section>

        <button type="submit" className="btn btn-primary">
          Sačuvaj postavke
        </button>
      </form>

      <section className="mt-12 border border-cobalt/40 bg-white p-5">
        <div className="flex items-start gap-3">
          <IconAlert className="mt-0.5 h-5 w-5 shrink-0 text-cobalt" />
          <div>
            <h2 className="h-display-narrow mb-1 text-base">
              Vrati na početno stanje
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-steel">
              Katalog se vraća na 24 proizvoda iz koda, narudžbe se zamjenjuju
              demo primjerima, a postavke idu na podrazumijevane vrijednosti.
              Sve tvoje izmjene se gube.
            </p>
            <button
              type="button"
              onClick={() => setReset(true)}
              className="btn btn-ghost-dark"
            >
              Vrati na početno
            </button>
          </div>
        </div>
      </section>

      {reset && (
        <Potvrda
          naslov="Vratiti sve na početno?"
          opis="Svi dodani i izmijenjeni proizvodi, narudžbe i postavke bit će obrisani. Ovo se ne može poništiti."
          potvrdiTekst="Vrati na početno"
          onPotvrdi={() => {
            resetuj();
            setReset(false);
          }}
          onOdustani={() => setReset(false)}
        />
      )}
    </div>
  );
}
