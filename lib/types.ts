export type Kategorija =
  | "duksevi"
  | "majice"
  | "jakne"
  | "pantalone"
  | "patike"
  | "dodaci";

export interface KategorijaInfo {
  slug: Kategorija;
  naziv: string;
  slika: string;
}

export interface Product {
  slug: string;
  naziv: string;
  kategorija: Kategorija;
  /** Cijena u KM */
  cijena: number;
  /** Ranija cijena — postoji samo za sniženo */
  staraCijena?: number;
  velicine: string[];
  boja: string;
  opis: string;
  materijal: string;
  odrzavanje: string;
  /** Putanje pod /products/, prva je glavna */
  slike: string[];
  novo?: boolean;
  istaknuto?: boolean;
}
