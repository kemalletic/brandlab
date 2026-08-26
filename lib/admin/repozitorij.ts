/**
 * Jedina tačka dodira s pohranom podataka.
 *
 * ── Kad dođe backend ──────────────────────────────────────────────────────
 * Zamijeni tijela funkcija ispod pozivima na svoj API. Potpisi su namjerno
 * `Promise`-based iako trenutna implementacija radi sinhrono nad
 * localStorage-om, pa se prelazak svodi na izmjenu ovog jednog fajla —
 * nijedna komponenta ne zna odakle podaci dolaze.
 *
 *   učitajSve()        → GET  /api/admin/podaci
 *   sacuvajProizvode() → PUT  /api/admin/proizvodi
 *   sacuvajNarudzbe()  → PUT  /api/admin/narudzbe
 *   sacuvajPostavke()  → PUT  /api/admin/postavke
 */

import { PROIZVODI } from "@/lib/products";
import type { Product } from "@/lib/types";
import {
  PODRAZUMIJEVANE_POSTAVKE,
  type AdminPodaci,
  type Narudzba,
  type Postavke,
} from "./tipovi";

const KLJUC_PROIZVODI = "brandlab.admin.proizvodi";
const KLJUC_NARUDZBE = "brandlab.admin.narudzbe";
const KLJUC_POSTAVKE = "brandlab.admin.postavke";

function citaj<T>(kljuc: string, rezerva: T): T {
  if (typeof window === "undefined") return rezerva;
  try {
    const sirovo = window.localStorage.getItem(kljuc);
    return sirovo ? (JSON.parse(sirovo) as T) : rezerva;
  } catch {
    return rezerva;
  }
}

function pisi(kljuc: string, vrijednost: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(kljuc, JSON.stringify(vrijednost));
  } catch {
    // Kvota puna ili privatni prozor — izmjena ostaje samo u memoriji.
  }
}

export async function ucitajSve(): Promise<AdminPodaci> {
  return {
    // Katalog iz lib/products.ts je polazno stanje; admin ga od prve izmjene
    // nadalje drži u svojoj kopiji.
    proizvodi: citaj<Product[]>(KLJUC_PROIZVODI, PROIZVODI),
    narudzbe: citaj<Narudzba[]>(KLJUC_NARUDZBE, []),
    postavke: citaj<Postavke>(KLJUC_POSTAVKE, PODRAZUMIJEVANE_POSTAVKE),
  };
}

export async function sacuvajProizvode(proizvodi: Product[]): Promise<void> {
  pisi(KLJUC_PROIZVODI, proizvodi);
}

export async function sacuvajNarudzbe(narudzbe: Narudzba[]): Promise<void> {
  pisi(KLJUC_NARUDZBE, narudzbe);
}

export async function sacuvajPostavke(postavke: Postavke): Promise<void> {
  pisi(KLJUC_POSTAVKE, postavke);
}

/** Vraća katalog na sadržaj iz lib/products.ts i briše narudžbe. */
export async function vratiNaPocetno(): Promise<void> {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KLJUC_PROIZVODI);
  window.localStorage.removeItem(KLJUC_NARUDZBE);
  window.localStorage.removeItem(KLJUC_POSTAVKE);
}
