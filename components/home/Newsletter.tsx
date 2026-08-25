"use client";

import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import Reveal from "@/components/Reveal";

export default function Newsletter() {
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
    <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="label-tech label-tech-cobalt mb-3">Newsletter</p>
          <h2 className="h-display text-[clamp(1.75rem,5vw,3.5rem)]">
            Saznaj prvi za drop
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-steel">
            Jedna poruka po dropu. Bez reklama, bez prosljeđivanja adrese.
          </p>
          <form
            onSubmit={prijavi}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tvoj@email.com"
              aria-label="Email adresa"
              className="h-12 w-full border border-line px-4 text-sm outline-none focus:border-cobalt"
            />
            <button type="submit" className="btn btn-primary shrink-0">
              Prijavi se
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}
