/** 129 → "129,00 KM" */
export function cijenaKM(n: number): string {
  return (
    n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " KM"
  );
}

/** Popust u postotku, zaokružen: (199, 249) → 20 */
export function popustPosto(cijena: number, staraCijena: number): number {
  return Math.round((1 - cijena / staraCijena) * 100);
}

/** "Šorc DŽEP" → "sorc dzep" — za pretragu bez dijakritike */
export function normalizuj(s: string): string {
  return s
    .toLowerCase()
    .replace(/č|ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/dž/g, "dz");
}

const MJESECI = [
  "januar", "februar", "mart", "april", "maj", "juni",
  "juli", "august", "septembar", "oktobar", "novembar", "decembar",
];

/** ISO datum → "25.08.2026" */
export function datumKratko(iso: string): string {
  const d = new Date(iso);
  const dan = String(d.getDate()).padStart(2, "0");
  const mjesec = String(d.getMonth() + 1).padStart(2, "0");
  return `${dan}.${mjesec}.${d.getFullYear()}.`;
}

/** ISO datum → "25. august 2026." */
export function datumPuni(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}. ${MJESECI[d.getMonth()]} ${d.getFullYear()}.`;
}
