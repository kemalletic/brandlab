"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import AuthLayout from "@/components/AuthLayout";
import AuthField from "@/components/AuthField";

export default function PrijavaClient() {
  const router = useRouter();
  const { toast } = useStore();
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greske, setGreske] = useState<{ email?: string; lozinka?: string }>({});
  const [salje, setSalje] = useState(false);

  function posalji(e: FormEvent) {
    e.preventDefault();
    const novi: typeof greske = {};
    if (!email.trim()) novi.email = "Unesi email adresu.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      novi.email = "Email adresa nije ispravna.";
    if (!lozinka) novi.lozinka = "Unesi lozinku.";
    setGreske(novi);
    if (Object.keys(novi).length > 0) return;

    setSalje(true);
    toast("Demo — prijava nije stvarna");
    setTimeout(() => router.push("/"), 900);
  }

  return (
    <AuthLayout
      eyebrow="Prijava"
      naslov="Prijavi se"
      podnaslov="Nastavi tamo gdje si stao — narudžbe i sačuvani komadi na jednom mjestu."
      slika="/products/hero-02.jpg"
      podnozje={
        <>
          Nemaš račun?{" "}
          <Link href="/registracija" className="link-sweep font-semibold text-ink">
            Otvori ga besplatno
          </Link>
        </>
      }
    >
      <form onSubmit={posalji} noValidate className="space-y-5">
        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="tvoj@email.com"
          value={email}
          onChange={setEmail}
          greska={greske.email}
        />
        <AuthField
          id="lozinka"
          label="Lozinka"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={lozinka}
          onChange={setLozinka}
          greska={greske.lozinka}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-steel">
            <input type="checkbox" className="accent-cobalt" />
            Zapamti me
          </label>
          <span className="text-xs text-steel">Zaboravljena lozinka?</span>
        </div>

        <button type="submit" disabled={salje} className="btn btn-primary w-full">
          {salje ? "Prijavljivanje…" : "Prijavi se"}
        </button>

        <p className="border-l-2 border-cobalt bg-smoke px-4 py-3 text-xs leading-relaxed text-steel">
          Demo prodavnica — podaci se ne šalju nigdje i račun se ne kreira.
        </p>
      </form>
    </AuthLayout>
  );
}
