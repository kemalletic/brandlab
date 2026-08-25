"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { KATEGORIJE } from "@/lib/products";

const POMOC = [
  "Dostava i rokovi",
  "Povrat i zamjena",
  "Tabela veličina",
  "Kontakt",
];

const BREND = ["O nama", "Održivost", "Prodajna mjesta", "Karijere"];

export default function Footer() {
  const { toast } = useStore();
  const [email, setEmail] = useState("");

  function prijavi(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast("Unesi ispravnu email adresu");
      return;
    }
    setEmail("");
    toast("Prijava zabilježena");
  }

  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto max-w-[1600px] px-5 pt-16 sm:px-8">
        <div className="grid gap-10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label-tech mb-4 text-white/40">Kolekcije</p>
            <ul className="space-y-2.5">
              {KATEGORIJE.map((k) => (
                <li key={k.slug}>
                  <Link
                    href={`/shop?kategorija=${k.slug}`}
                    className="link-sweep text-sm text-white/80"
                  >
                    {k.naziv}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-tech mb-4 text-white/40">Pomoć</p>
            <ul className="space-y-2.5">
              {POMOC.map((p) => (
                <li key={p}>
                  <span className="text-sm text-white/80">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-tech mb-4 text-white/40">Brend</p>
            <ul className="space-y-2.5">
              {BREND.map((b) => (
                <li key={b}>
                  {b === "O nama" ? (
                    <Link href="/o-nama" className="link-sweep text-sm text-white/80">
                      {b}
                    </Link>
                  ) : (
                    <span className="text-sm text-white/80">{b}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-tech mb-4 text-white/40">Newsletter</p>
            <p className="mb-4 text-sm text-white/70">
              Novi dropovi stižu prvo na mail. Bez spama.
            </p>
            <form onSubmit={prijavi} className="flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tvoj@email.com"
                aria-label="Email adresa"
                className="h-11 w-full min-w-0 border border-white/25 bg-transparent px-3 text-sm outline-none placeholder:text-white/35 focus:border-cobalt"
              />
              <button
                type="submit"
                className="h-11 shrink-0 bg-cobalt px-4 text-xs font-bold uppercase tracking-[0.1em] transition-colors hover:bg-white hover:text-ink"
              >
                Prijavi se
              </button>
            </form>
          </div>
        </div>

        <div className="overflow-hidden border-t border-white/10 pt-8">
          <p className="h-display select-none text-[clamp(3rem,14vw,11rem)] leading-[0.8] text-white/[0.07]">
            BRANDLAB
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © 2026 BRANDLAB. Sva prava zadržana.
          </p>
          <div className="flex gap-5">
            {["Instagram", "TikTok", "YouTube"].map((s) => (
              <span
                key={s}
                className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
