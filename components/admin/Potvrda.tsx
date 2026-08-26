"use client";

import { useEffect } from "react";
import { IconAlert } from "@/components/Icons";

export default function Potvrda({
  naslov,
  opis,
  potvrdiTekst = "Obriši",
  onPotvrdi,
  onOdustani,
}: {
  naslov: string;
  opis: string;
  potvrdiTekst?: string;
  onPotvrdi: () => void;
  onOdustani: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOdustani();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onOdustani]);

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Odustani"
        onClick={onOdustani}
        className="fade-in absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <div
        role="alertdialog"
        aria-label={naslov}
        className="slide-in-up relative w-full max-w-sm bg-white p-6"
      >
        <IconAlert className="mb-4 h-8 w-8 text-cobalt" />
        <h2 className="h-display-narrow mb-2 text-lg">{naslov}</h2>
        <p className="mb-6 text-sm leading-relaxed text-steel">{opis}</p>
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={onOdustani}
            className="btn btn-ghost-dark flex-1"
          >
            Odustani
          </button>
          <button
            type="button"
            onClick={onPotvrdi}
            className="btn btn-primary flex-1"
          >
            {potvrdiTekst}
          </button>
        </div>
      </div>
    </div>
  );
}
