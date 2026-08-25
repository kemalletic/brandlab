import type { Kategorija, KategorijaInfo, Product } from "./types";

export const KATEGORIJE: KategorijaInfo[] = [
  { slug: "duksevi", naziv: "Duksevi", slika: "/products/duks-01.jpg" },
  { slug: "majice", naziv: "Majice", slika: "/products/majica-03.jpg" },
  { slug: "jakne", naziv: "Jakne", slika: "/products/jakna-04.jpg" },
  { slug: "pantalone", naziv: "Pantalone", slika: "/products/pantalone-02.jpg" },
  { slug: "patike", naziv: "Patike", slika: "/products/patike-06.jpg" },
  { slug: "dodaci", naziv: "Dodaci", slika: "/products/dodatak-04.jpg" },
];

const VEL_ODJECA = ["XS", "S", "M", "L", "XL", "XXL"];
const VEL_PANTALONE = ["28", "30", "32", "34", "36", "38"];
const VEL_PATIKE = ["40", "41", "42", "43", "44", "45"];
const VEL_UNI = ["UNI"];

export const PROIZVODI: Product[] = [
  // ───────────────────────── DUKSEVI ─────────────────────────
  {
    slug: "duks-core-01",
    naziv: "Duks Core 01",
    kategorija: "duksevi",
    cijena: 149,
    velicine: VEL_ODJECA,
    boja: "Crna",
    opis:
      "Težak crewneck duks kroja koji stoji ravno preko ramena. Vezeni logo na grudima, rebrasti rubovi koji ne popuštaju nakon pranja. Osnovni komad kolekcije — nosi se sam ili preko majice.",
    materijal: "80% pamuk, 20% poliester — 420 g/m²",
    odrzavanje: "Pranje na 30°C, ne izbjeljivati, sušiti ravno položeno.",
    slike: ["/products/duks-08.jpg", "/products/duks-10.jpg"],
    novo: true,
    istaknuto: true,
  },
  {
    slug: "duks-club-fw26",
    naziv: "Duks Club FW26",
    kategorija: "duksevi",
    cijena: 169,
    staraCijena: 209,
    velicine: VEL_ODJECA,
    boja: "Crna",
    opis:
      "Duks s printom na grudima iz jesenje kolekcije. Opušteniji kroj, spušteno rame, mekana unutrašnja strana. Print je odštampan vodenom bojom pa ostaje mek na dodir.",
    materijal: "100% češljani pamuk — 380 g/m²",
    odrzavanje: "Pranje naopako na 30°C, peglati s unutrašnje strane.",
    slike: ["/products/duks-10.jpg", "/products/duks-08.jpg"],
    istaknuto: true,
  },
  {
    slug: "hoodie-terrain",
    naziv: "Hoodie Terrain",
    kategorija: "duksevi",
    cijena: 179,
    velicine: VEL_ODJECA,
    boja: "Siva",
    opis:
      "Hoodie s dvoslojnom kapuljačom koja drži oblik i kad je spuštena. Kengur džep prošiven po sredini, manžete koje ne propuštaju vjetar. Nosi se preko svega.",
    materijal: "85% pamuk, 15% poliester — 450 g/m²",
    odrzavanje: "Pranje na 30°C, ne sušiti u mašini.",
    slike: ["/products/duks-01.jpg", "/products/look-05.jpg"],
    novo: true,
  },
  {
    slug: "hoodie-signal",
    naziv: "Hoodie Signal",
    kategorija: "duksevi",
    cijena: 189,
    velicine: VEL_ODJECA,
    boja: "Narandžasta",
    opis:
      "Hoodie u signalnoj narandžastoj — jedini komad u kolekciji koji se ne uklapa u pozadinu. Isti kroj kao Terrain, drugi karakter.",
    materijal: "85% pamuk, 15% poliester — 450 g/m²",
    odrzavanje: "Prati odvojeno prva dva pranja, na 30°C.",
    slike: ["/products/duks-06.jpg", "/products/hero-02.jpg"],
  },

  // ───────────────────────── MAJICE ─────────────────────────
  {
    slug: "majica-blank",
    naziv: "Majica Blank",
    kategorija: "majice",
    cijena: 59,
    velicine: VEL_ODJECA,
    boja: "Bijela",
    opis:
      "Bijela majica bez ijednog printa. Gusto tkanje koje se ne providi, ojačan ovratnik, ravan donji rub. Ono što nosiš kad ne razmišljaš šta ćeš obući.",
    materijal: "100% organski pamuk — 220 g/m²",
    odrzavanje: "Pranje na 40°C, sušenje u mašini na niskoj temperaturi.",
    slike: ["/products/majica-01.jpg", "/products/look-03.jpg"],
    istaknuto: true,
  },
  {
    slug: "majica-stamp",
    naziv: "Majica Stamp",
    kategorija: "majice",
    cijena: 69,
    velicine: VEL_ODJECA,
    boja: "Crna",
    opis:
      "Crna majica s malim kružnim znakom na grudima. Print je jedini detalj — ostalo je čist kroj s ravnim ramenima.",
    materijal: "100% pamuk — 240 g/m²",
    odrzavanje: "Pranje naopako na 30°C, ne peglati preko printa.",
    slike: ["/products/majica-03.jpg", "/products/dodatak-07.jpg"],
    novo: true,
  },
  {
    slug: "majica-original",
    naziv: "Majica Original",
    kategorija: "majice",
    cijena: 79,
    staraCijena: 99,
    velicine: VEL_ODJECA,
    boja: "Pijesak",
    opis:
      "Grafička majica s printom preko cijelih prsa u kobalt plavoj. Pješčana osnova drži print čitkim bez da viče.",
    materijal: "100% pamuk — 240 g/m²",
    odrzavanje: "Pranje naopako na 30°C, ne koristiti omekšivač.",
    slike: ["/products/majica-02.jpg", "/products/majica-07.jpg"],
    istaknuto: true,
  },
  {
    slug: "majica-heavy",
    naziv: "Majica Heavy Oversized",
    kategorija: "majice",
    cijena: 89,
    velicine: VEL_ODJECA,
    boja: "Crna",
    opis:
      "Oversized kroj s kontrastnim šavovima i spuštenim ramenom. Deblji materijal od standardne majice — pada ravno, ne lijepi se.",
    materijal: "100% pamuk — 280 g/m²",
    odrzavanje: "Pranje na 30°C, sušiti ravno položeno.",
    slike: ["/products/duks-11.jpg", "/products/duks-05.jpg"],
    novo: true,
  },
  {
    slug: "majica-essentials-3pack",
    naziv: "Majice Essentials 3-pack",
    kategorija: "majice",
    cijena: 139,
    staraCijena: 177,
    velicine: VEL_ODJECA,
    boja: "Miks",
    opis:
      "Tri osnovne majice u paketu — crna, bijela i tamnoplava. Isti kroj kao Blank, cijena po komadu niža.",
    materijal: "100% organski pamuk — 220 g/m²",
    odrzavanje: "Pranje na 40°C, boje prati odvojeno prvi put.",
    slike: ["/products/majica-07.jpg", "/products/majica-01.jpg"],
  },

  // ───────────────────────── JAKNE ─────────────────────────
  {
    slug: "jakna-moto",
    naziv: "Jakna Moto",
    kategorija: "jakne",
    cijena: 449,
    velicine: VEL_ODJECA,
    boja: "Crna",
    opis:
      "Bajkerska jakna s asimetričnim patentom i kragnom koja se zakopčava do vrha. Metalni okovi, kosi džepovi na grudima. Kroj prati tijelo bez stezanja.",
    materijal: "Vještačka koža, podstava 100% viskoza",
    odrzavanje: "Čistiti vlažnom krpom, ne prati u mašini.",
    slike: ["/products/jakna-01.jpg", "/products/look-05.jpg"],
    istaknuto: true,
  },
  {
    slug: "jakna-puffer",
    naziv: "Jakna Puffer Grid",
    kategorija: "jakne",
    cijena: 379,
    staraCijena: 459,
    velicine: VEL_ODJECA,
    boja: "Crna",
    opis:
      "Prošivena zimska jakna s dva patenta i visokom kragnom. Punjenje drži toplotu bez volumena — ne pravi te širim nego jesi.",
    materijal: "Vanjski sloj 100% najlon, punjenje 100% poliester",
    odrzavanje: "Pranje na 30°C s kuglicama za sušenje, ne cijediti.",
    slike: ["/products/jakna-04.jpg", "/products/hero-02.jpg"],
    novo: true,
    istaknuto: true,
  },
  {
    slug: "jakna-bomber",
    naziv: "Jakna Bomber Lite",
    kategorija: "jakne",
    cijena: 259,
    velicine: VEL_ODJECA,
    boja: "Cigla",
    opis:
      "Lagani bomber za prelazne mjesece. Rebrasta kragna i manžete, džep s patentom na rukavu, bez podstave.",
    materijal: "100% poliester",
    odrzavanje: "Pranje na 30°C, ne sušiti u mašini.",
    slike: ["/products/jakna-02.jpg", "/products/hero-01.jpg"],
  },
  {
    slug: "jakna-denim-rigid",
    naziv: "Jakna Denim Rigid",
    kategorija: "jakne",
    cijena: 289,
    velicine: VEL_ODJECA,
    boja: "Indigo",
    opis:
      "Traper jakna od neispranog denima s kontrastnom kragnom od somota. Nosi se dok ne dobije tvoje nabore — tako i treba.",
    materijal: "100% pamučni denim — 14 oz",
    odrzavanje: "Prati rijetko, naopako, na 30°C. Sušiti u hladu.",
    slike: ["/products/duks-02.jpg", "/products/look-08.jpg"],
    novo: true,
  },

  // ───────────────────────── PANTALONE ─────────────────────────
  {
    slug: "pantalone-denim-classic",
    naziv: "Pantalone Denim Classic",
    kategorija: "pantalone",
    cijena: 179,
    velicine: VEL_PANTALONE,
    boja: "Plava",
    opis:
      "Ravan kroj kroz bedro i list, srednji struk. Denim s malim udjelom elastina koji drži oblik cijeli dan.",
    materijal: "98% pamuk, 2% elastin — 12 oz",
    odrzavanje: "Pranje naopako na 30°C, ne sušiti u mašini.",
    slike: ["/products/pantalone-01.jpg", "/products/pantalone-03.jpg"],
    istaknuto: true,
  },
  {
    slug: "pantalone-chino-track",
    naziv: "Pantalone Chino Track",
    kategorija: "pantalone",
    cijena: 149,
    staraCijena: 189,
    velicine: VEL_PANTALONE,
    boja: "Pijesak",
    opis:
      "Chino sa suženim krajem nogavice i gumom u struku. Dovoljno uredne za grad, dovoljno udobne za cijeli dan.",
    materijal: "97% pamuk, 3% elastin",
    odrzavanje: "Pranje na 30°C, peglati na srednjoj temperaturi.",
    slike: ["/products/pantalone-02.jpg", "/products/look-01.jpg"],
  },
  {
    slug: "pantalone-tapered-crne",
    naziv: "Pantalone Tapered",
    kategorija: "pantalone",
    cijena: 159,
    velicine: VEL_PANTALONE,
    boja: "Crna",
    opis:
      "Crne pantalone koje se sužavaju od koljena naniže. Bez vanjskih šavova na džepovima — čista linija sa strane.",
    materijal: "65% pamuk, 32% poliester, 3% elastin",
    odrzavanje: "Pranje na 30°C, ne izbjeljivati.",
    slike: ["/products/sorc-05.jpg", "/products/hero-01.jpg"],
    novo: true,
  },

  // ───────────────────────── PATIKE ─────────────────────────
  {
    slug: "patike-court-low",
    naziv: "Patike Court Low",
    kategorija: "patike",
    cijena: 299,
    velicine: VEL_PATIKE,
    boja: "Crna / crvena",
    opis:
      "Niske košarkaške patike s kožnim gornjištem i gumenim đonom koji drži na mokrom. Klasičan oblik koji ne izlazi iz mode.",
    materijal: "Gornjište prava koža, đon guma",
    odrzavanje: "Čistiti mekom četkom i vlažnom krpom.",
    slike: ["/products/patike-01.jpg", "/products/look-08.jpg"],
    istaknuto: true,
  },
  {
    slug: "patike-high-white",
    naziv: "Patike High White",
    kategorija: "patike",
    cijena: 329,
    velicine: VEL_PATIKE,
    boja: "Bijela",
    opis:
      "Visoke patike u cijelosti bijele, s trakom preko rista. Kožno gornjište koje se čisti jednim potezom krpe.",
    materijal: "Gornjište prava koža, unutrašnjost tekstil",
    odrzavanje: "Zaštititi sprejom prije prvog nošenja.",
    slike: ["/products/patike-06.jpg", "/products/look-05.jpg"],
    novo: true,
    istaknuto: true,
  },
  {
    slug: "patike-runner",
    naziv: "Patike Runner",
    kategorija: "patike",
    cijena: 279,
    staraCijena: 339,
    velicine: VEL_PATIKE,
    boja: "Bijela / narandžasta",
    opis:
      "Patike za svaki dan s mekim međuđonom i perforiranim gornjištem. Lagane su onoliko koliko izgledaju.",
    materijal: "Gornjište sintetička koža i mesh, međuđon EVA",
    odrzavanje: "Prati ručno, ne stavljati u mašinu.",
    slike: ["/products/patike-02.jpg", "/products/look-01.jpg"],
  },

  // ───────────────────────── DODACI ─────────────────────────
  {
    slug: "kapa-washed",
    naziv: "Kapa Washed",
    kategorija: "dodaci",
    cijena: 49,
    velicine: VEL_UNI,
    boja: "Antracit",
    opis:
      "Kapa od opranog pamuka s mekim, savijenim štitnikom. Kaiš sa kopčom otraga — sjedne na svaku glavu.",
    materijal: "100% pamuk",
    odrzavanje: "Prati ručno u hladnoj vodi, sušiti na oblik.",
    slike: ["/products/kapa-01.jpg", "/products/dodatak-01.jpg"],
    istaknuto: true,
  },
  {
    slug: "kapa-trucker",
    naziv: "Kapa Trucker",
    kategorija: "dodaci",
    cijena: 45,
    velicine: VEL_UNI,
    boja: "Bijela",
    opis:
      "Trucker kapa s mrežastim stražnjim dijelom i ravnim štitnikom. Prednja strana ostavljena prazna — namjerno.",
    materijal: "Prednji dio pamuk, stražnji poliesterska mreža",
    odrzavanje: "Prati ručno, ne peglati.",
    slike: ["/products/dodatak-05.jpg", "/products/kapa-01.jpg"],
    novo: true,
  },
  {
    slug: "ruksak-tech",
    naziv: "Ruksak Tech 22L",
    kategorija: "dodaci",
    cijena: 199,
    velicine: VEL_UNI,
    boja: "Crna",
    opis:
      "Ruksak od 22 litre s podstavljenim pretincem za laptop do 16 inča. Vodoodbojno platno, patenti koji se ne zaglavljuju.",
    materijal: "Vodoodbojni poliester 600D",
    odrzavanje: "Čistiti vlažnom krpom, ne prati u mašini.",
    slike: ["/products/dodatak-04.jpg", "/products/dodatak-03.jpg"],
    istaknuto: true,
  },
  {
    slug: "ruksak-kozni",
    naziv: "Ruksak Kožni",
    kategorija: "dodaci",
    cijena: 349,
    staraCijena: 419,
    velicine: VEL_UNI,
    boja: "Konjak",
    opis:
      "Ruksak od pune goveđe kože koja s vremenom tamni. Jedan veliki pretinac, prednji džep, bočni otvori za flašu.",
    materijal: "Puna goveđa koža, podstava pamučno platno",
    odrzavanje: "Njegovati kremom za kožu dva puta godišnje.",
    slike: ["/products/dodatak-03.jpg", "/products/dodatak-04.jpg"],
  },
  {
    slug: "naocale-round",
    naziv: "Naočale Round",
    kategorija: "dodaci",
    cijena: 119,
    velicine: VEL_UNI,
    boja: "Zlatna / zelena",
    opis:
      "Okrugle sunčane naočale s tankim metalnim okvirom i staklima kategorije 3. Dolaze s tvrdom futrolom i krpicom.",
    materijal: "Okvir metal, stakla polikarbonat UV400",
    odrzavanje: "Čistiti isključivo priloženom krpicom.",
    slike: ["/products/naocale-01.jpg", "/products/look-01.jpg"],
    novo: true,
  },
];

// ───────────────────────── Pomoćne funkcije ─────────────────────────

export function nadjiProizvod(slug: string): Product | undefined {
  return PROIZVODI.find((p) => p.slug === slug);
}

export function proizvodiPoKategoriji(kategorija: Kategorija): Product[] {
  return PROIZVODI.filter((p) => p.kategorija === kategorija);
}

export function noviProizvodi(): Product[] {
  return PROIZVODI.filter((p) => p.novo);
}

export function istaknutiProizvodi(): Product[] {
  return PROIZVODI.filter((p) => p.istaknuto);
}

export function srodniProizvodi(proizvod: Product, koliko = 4): Product[] {
  return PROIZVODI.filter(
    (p) => p.kategorija === proizvod.kategorija && p.slug !== proizvod.slug,
  ).slice(0, koliko);
}

export function nazivKategorije(slug: Kategorija): string {
  return KATEGORIJE.find((k) => k.slug === slug)?.naziv ?? slug;
}

/** Sve veličine koje se pojavljuju, redom odjeća → pantalone → patike → UNI */
export const SVE_VELICINE = [
  ...VEL_ODJECA,
  ...VEL_PANTALONE,
  ...VEL_PATIKE,
  ...VEL_UNI,
];

export const MAX_CIJENA = Math.max(...PROIZVODI.map((p) => p.cijena));
export const PRAG_BESPLATNE_DOSTAVE = 100;
export const CIJENA_DOSTAVE = 7;
