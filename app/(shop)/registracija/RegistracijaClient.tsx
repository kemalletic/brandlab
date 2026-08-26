"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import AuthLayout from "@/components/AuthLayout";
import AuthField from "@/components/AuthField";
import { IconCheck } from "@/components/Icons";

interface Polja {
  ime: string;
  prezime: string;
  email: string;
  lozinka: string;
}

/** 0–4; svaki ispunjen uslov nosi jedan bod. */
function jacinaLozinke(l: string): number {
  let bod = 0;
  if (l.length >= 8) bod++;
  if (/[a-z]/.test(l) && /[A-Z]/.test(l)) bod++;
  if (/\d/.test(l)) bod++;
  if (/[^A-Za-z0-9]/.test(l)) bod++;
  return bod;
}

const OZNAKE = ["Preslaba", "Slaba", "Solidna", "Jaka", "Vrlo jaka"];

export default function RegistracijaClient() {
  const router = useRouter();
  const { toast } = useStore();
  const [polja, setPolja] = useState<Polja>({
    ime: "",
    prezime: "",
    email: "",
    lozinka: "",
  });
  const [uslovi, setUslovi] = useState(false);
  const [greske, setGreske] = useState<
    Partial<Record<keyof Polja | "uslovi", string>>
  >({});
  const [salje, setSalje] = useState(false);

  const jacina = jacinaLozinke(polja.lozinka);

  function postavi(k: keyof Polja) {
    return (v: string) => setPolja((p) => ({ ...p, [k]: v }));
  }

  function posalji(e: FormEvent) {
    e.preventDefault();
    const novi: typeof greske = {};
    if (!polja.ime.trim()) novi.ime = "Unesi ime.";
    if (!polja.prezime.trim()) novi.prezime = "Unesi prezime.";
    if (!polja.email.trim()) novi.email = "Unesi email adresu.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(polja.email))
      novi.email = "Email adresa nije ispravna.";
    if (!polja.lozinka) novi.lozinka = "Unesi lozinku.";
    else if (polja.lozinka.length < 8)
      novi.lozinka = "Lozinka mora imati najmanje 8 znakova.";
    if (!uslovi) novi.uslovi = "Prihvati uslove da nastaviš.";
    setGreske(novi);
    if (Object.keys(novi).length > 0) return;

    setSalje(true);
    toast("Demo — račun nije stvarno kreiran");
    setTimeout(() => router.push("/"), 900);
  }

  return (
    <AuthLayout
      eyebrow="Registracija"
      naslov="Otvori račun"
      podnaslov="Brža naplata, historija narudžbi i favoriti na svim uređajima."
      slika="/products/look-08.jpg"
      podnozje={
        <>
          Već imaš račun?{" "}
          <Link href="/prijava" className="link-sweep font-semibold text-ink">
            Prijavi se
          </Link>
        </>
      }
    >
      <form onSubmit={posalji} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            id="ime"
            label="Ime"
            autoComplete="given-name"
            value={polja.ime}
            onChange={postavi("ime")}
            greska={greske.ime}
          />
          <AuthField
            id="prezime"
            label="Prezime"
            autoComplete="family-name"
            value={polja.prezime}
            onChange={postavi("prezime")}
            greska={greske.prezime}
          />
        </div>

        <AuthField
          id="email-reg"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="tvoj@email.com"
          value={polja.email}
          onChange={postavi("email")}
          greska={greske.email}
        />

        <div>
          <AuthField
            id="lozinka-reg"
            label="Lozinka"
            type="password"
            autoComplete="new-password"
            placeholder="Najmanje 8 znakova"
            value={polja.lozinka}
            onChange={postavi("lozinka")}
            greska={greske.lozinka}
          />
          {polja.lozinka && !greske.lozinka && (
            <div className="mt-2.5">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-[3px] flex-1 transition-colors ${
                      i < jacina ? "bg-cobalt" : "bg-line"
                    }`}
                  />
                ))}
              </div>
              <p className="label-tech mt-1.5">{OZNAKE[jacina]}</p>
            </div>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-steel">
            <input
              type="checkbox"
              checked={uslovi}
              onChange={(e) => setUslovi(e.target.checked)}
              className="mt-0.5 accent-cobalt"
            />
            <span>
              Prihvatam uslove korištenja i pravila o privatnosti.
            </span>
          </label>
          {greske.uslovi && (
            <p role="alert" className="mt-1.5 text-xs text-cobalt">
              {greske.uslovi}
            </p>
          )}
        </div>

        <button type="submit" disabled={salje} className="btn btn-primary w-full">
          {salje ? "Kreiranje…" : "Otvori račun"}
        </button>

        <ul className="space-y-2 pt-1">
          {[
            "Brža naplata bez ponovnog upisivanja adrese",
            "Historija narudžbi na jednom mjestu",
            "Favoriti sačuvani na svim uređajima",
          ].map((p) => (
            <li key={p} className="flex items-start gap-2 text-xs text-steel">
              <IconCheck className="mt-px h-4 w-4 shrink-0 text-cobalt" />
              {p}
            </li>
          ))}
        </ul>

        <p className="border-l-2 border-cobalt bg-smoke px-4 py-3 text-xs leading-relaxed text-steel">
          Demo prodavnica — podaci se ne šalju nigdje i račun se ne kreira.
        </p>
      </form>
    </AuthLayout>
  );
}
