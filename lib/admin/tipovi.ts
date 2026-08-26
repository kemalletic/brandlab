import type { Product } from "@/lib/types";

export type StatusNarudzbe =
  | "nova"
  | "u-obradi"
  | "poslana"
  | "isporucena"
  | "otkazana";

export const STATUSI: { value: StatusNarudzbe; label: string }[] = [
  { value: "nova", label: "Nova" },
  { value: "u-obradi", label: "U obradi" },
  { value: "poslana", label: "Poslana" },
  { value: "isporucena", label: "Isporučena" },
  { value: "otkazana", label: "Otkazana" },
];

export interface StavkaNarudzbe {
  slug: string;
  naziv: string;
  velicina: string;
  kolicina: number;
  /** Cijena po komadu u trenutku narudžbe — ne prati kasnije izmjene. */
  cijena: number;
}

export interface Narudzba {
  id: string;
  datum: string;
  status: StatusNarudzbe;
  kupac: {
    ime: string;
    prezime: string;
    email: string;
    telefon: string;
    adresa: string;
    grad: string;
    postanski: string;
  };
  stavke: StavkaNarudzbe[];
  nacinDostave: "standardna" | "brza";
  nacinPlacanja: "kartica" | "pouzece";
  medjuzbir: number;
  dostava: number;
  ukupno: number;
}

export interface Postavke {
  pragBesplatneDostave: number;
  cijenaDostave: number;
  doplataBrzaDostava: number;
  tickerPoruke: string[];
}

export const PODRAZUMIJEVANE_POSTAVKE: Postavke = {
  pragBesplatneDostave: 100,
  cijenaDostave: 7,
  doplataBrzaDostava: 8,
  tickerPoruke: [
    "Besplatna dostava iznad 100 KM",
    "Novi drop upravo stigao",
    "Brza dostava za 48h",
    "BRANDLAB — grad je tvoj teren",
  ],
};

/** Sve što admin drži na jednom mjestu. */
export interface AdminPodaci {
  proizvodi: Product[];
  narudzbe: Narudzba[];
  postavke: Postavke;
}
