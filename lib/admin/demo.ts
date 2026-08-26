import type { Product } from "@/lib/types";
import type { Narudzba, StatusNarudzbe } from "./tipovi";

const KUPCI = [
  { ime: "Amar", prezime: "Hodžić", grad: "Sarajevo", postanski: "71000", adresa: "Zmaja od Bosne 12" },
  { ime: "Dženan", prezime: "Kovačević", grad: "Tuzla", postanski: "75000", adresa: "Turalibegova 44" },
  { ime: "Marko", prezime: "Perić", grad: "Mostar", postanski: "88000", adresa: "Kralja Tomislava 7" },
  { ime: "Nikola", prezime: "Savić", grad: "Banja Luka", postanski: "78000", adresa: "Gundulićeva 21" },
  { ime: "Haris", prezime: "Begić", grad: "Zenica", postanski: "72000", adresa: "Maršala Tita 3" },
  { ime: "Emir", prezime: "Šahinović", grad: "Bihać", postanski: "77000", adresa: "Bosanska 19" },
];

const RASPORED: {
  statusi: StatusNarudzbe;
  prijeDana: number;
  indeksi: number[];
  kolicine: number[];
  dostava: "standardna" | "brza";
  placanje: "kartica" | "pouzece";
}[] = [
  { statusi: "nova", prijeDana: 1, indeksi: [0, 5], kolicine: [1, 2], dostava: "brza", placanje: "kartica" },
  { statusi: "nova", prijeDana: 2, indeksi: [9], kolicine: [1], dostava: "standardna", placanje: "pouzece" },
  { statusi: "u-obradi", prijeDana: 4, indeksi: [3, 12], kolicine: [1, 1], dostava: "standardna", placanje: "kartica" },
  { statusi: "poslana", prijeDana: 7, indeksi: [17], kolicine: [1], dostava: "brza", placanje: "kartica" },
  { statusi: "isporucena", prijeDana: 13, indeksi: [1, 7, 20], kolicine: [1, 3, 1], dostava: "standardna", placanje: "pouzece" },
  { statusi: "otkazana", prijeDana: 20, indeksi: [15], kolicine: [2], dostava: "standardna", placanje: "kartica" },
];

/**
 * Narudžbe za demonstraciju — bez njih su ploča i lista narudžbi prazne.
 * Sve je izvedeno iz prosljeđenog kataloga i fiksnog rasporeda, pa dva
 * poziva daju isti rezultat (nema Math.random ni Date.now u modulu).
 */
export function generisiDemoNarudzbe(proizvodi: Product[]): Narudzba[] {
  if (proizvodi.length === 0) return [];
  const sada = Date.now();

  return RASPORED.map((r, i) => {
    const kupac = KUPCI[i % KUPCI.length];

    const stavke = r.indeksi.map((idx, j) => {
      const p = proizvodi[idx % proizvodi.length];
      return {
        slug: p.slug,
        naziv: p.naziv,
        velicina: p.velicine[Math.min(2, p.velicine.length - 1)],
        kolicina: r.kolicine[j] ?? 1,
        cijena: p.cijena,
      };
    });

    const medjuzbir = stavke.reduce((s, st) => s + st.cijena * st.kolicina, 0);
    const osnovna = medjuzbir >= 100 ? 0 : 7;
    const dostava = r.dostava === "brza" ? osnovna + 8 : osnovna;

    return {
      id: `BL-${100000 + i * 7331}`,
      datum: new Date(sada - r.prijeDana * 86_400_000).toISOString(),
      status: r.statusi,
      kupac: {
        ...kupac,
        email: `${kupac.ime.toLowerCase()}.${kupac.prezime
          .toLowerCase()
          .replace(/[čćžšđ]/g, (c) => ({ č: "c", ć: "c", ž: "z", š: "s", đ: "d" })[c]!)}@primjer.ba`,
        telefon: `06${(i % 5) + 1} ${100 + i * 37} ${200 + i * 41}`,
      },
      stavke,
      nacinDostave: r.dostava,
      nacinPlacanja: r.placanje,
      medjuzbir,
      dostava,
      ukupno: medjuzbir + dostava,
    };
  });
}
