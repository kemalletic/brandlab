# BRANDLAB Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin sučelje na `/admin` kroz koje se upravlja proizvodima, narudžbama i postavkama prodavnice — brzo, bez mrežnog čekanja, spremno za spajanje na backend bez prepisivanja komponenti.

**Architecture:** Admin živi u vlastitoj route grupi s vlastitim layoutom (bez tickera, headera i korpe javnog sajta). Sve čitanje i pisanje podataka prolazi kroz `lib/admin/repozitorij.ts` — jedini fajl koji zna gdje podaci stoje. Komponente ga nikad ne zaobilaze, pa se prelazak na pravi backend svodi na izmjenu tog jednog fajla. Stanje se drži u jednom Contextu (`AdminProvider`) koji učita podatke jednom pri montiranju i dalje radi iz memorije — otud brzina.

**Tech Stack:** Next.js 16 App Router, TypeScript (strict), Tailwind v4, React Context, localStorage kao privremena pohrana.

**Spec:** Nema zaseban spec dokument — zahtjev je zadan u razgovoru 2026-08-26: „frontend za admina, treba jednostavno upravljati stranicom, da nije komplikovano i da nije sporo”, opseg „sve” (proizvodi, narudžbe, nadzorna ploča, postavke), uz izričito „trenutno samo UI radim, kasnije ću bazu i backend”.

## Global Constraints

- **Samo frontend.** Nikakav backend, baza ni API rute. Pohrana je localStorage kroz repozitorij sloj.
- **Sav pristup podacima ide kroz `lib/admin/repozitorij.ts`.** Nijedna komponenta ne smije direktno dirati `localStorage` ni importovati `PROIZVODI` radi izmjene.
- **Brzina je zahtjev.** Nema spinnera ni čekanja između akcija: podaci se učitaju jednom, sve dalje su operacije nad nizom u memoriji. Upis u pohranu je nusefekat, nikad ne blokira UI.
- **Sav tekst na bosanskom**, kao i ostatak projekta.
- **Vizuelni jezik:** isti tokeni iz `app/globals.css` — kobalt `#0038FF` kao akcent, `ink`, `paper`, `smoke`, `steel`, `line`; Archivo za naslove (`.h-display`, `.h-display-narrow`), Inter za tekst; oštre ivice; `.label-tech` za sitne oznake. Bez zaobljenja osim 2px na inputima.
- **Ikone isključivo iz `components/Icons.tsx`.** Nikad Unicode znakovi.
- **Javni sajt se ne dira.** Admin radi nad svojom kopijom kataloga. (Vidi „Van opsega”.)
- **Mobile-first**, touch mete min 44px, bez horizontalnog overflowa na 375 / 768 / 1440.
- **Bez novih npm paketa.**
- **Nema commitova** osim ako korisnik izričito zatraži.

## Van opsega (svjesna odluka)

Admin izmjene se **ne** odražavaju na javni sajt. Javne stranice ostaju statične (SSG) i čitaju `lib/products.ts`. Razlog: spajanje bi značilo prebacivanje javnih listi na klijentsko čitanje i gubitak SSG-a, a korisnik je rekao da backend dolazi kasnije — tada će oba dijela čitati iz baze. Ovo mora biti jasno napisano u UI-ju admina (traka u zaglavlju).

## File Structure

```
lib/admin/
  tipovi.ts        Narudzba, StatusNarudzbe, StavkaNarudzbe, Postavke, AdminPodaci  [GOTOVO]
  repozitorij.ts   ucitajSve / sacuvajProizvode / sacuvajNarudzbe / sacuvajPostavke / vratiNaPocetno  [GOTOVO]
  store.tsx        AdminProvider + useAdmin — stanje i sve operacije
  demo.ts          generisiDemoNarudzbe() — da narudžbe i ploča nisu prazne

app/admin/
  layout.tsx           AdminProvider + AdminShell
  page.tsx             nadzorna ploča
  proizvodi/page.tsx   lista + pretraga + filter + brisanje
  proizvodi/novi/page.tsx
  proizvodi/[slug]/page.tsx
  narudzbe/page.tsx
  narudzbe/[id]/page.tsx
  postavke/page.tsx

components/admin/
  AdminShell.tsx    sidebar (desktop) / donja traka (mobitel) + zaglavlje
  StatKartica.tsx   brojka + oznaka
  ProizvodForma.tsx forma za novi i za izmjenu (jedna, dva načina)
  StatusZnak.tsx    obojena oznaka statusa narudžbe
  PraznoStanje.tsx  ikona + poruka + akcija
  Potvrda.tsx       dijalog za potvrdu brisanja
```

## Interfaces (obavezuju sve taskove)

```ts
// lib/admin/store.tsx
interface AdminCtx {
  proizvodi: Product[];
  narudzbe: Narudzba[];
  postavke: Postavke;
  spremno: boolean;                 // false dok traje prvo učitavanje

  dodajProizvod(p: Product): void;
  izmijeniProizvod(slug: string, p: Product): void;
  obrisiProizvod(slug: string): void;
  nadjiPoSlugu(slug: string): Product | undefined;

  postaviStatus(id: string, status: StatusNarudzbe): void;
  obrisiNarudzbu(id: string): void;

  izmijeniPostavke(p: Postavke): void;
  resetuj(): void;                  // vraća na lib/products.ts + prazne narudžbe

  poruka: string | null;            // kratka potvrda akcije
  postaviPoruku(t: string): void;
}
export function useAdmin(): AdminCtx;   // throw izvan providera
```

---

### Task 1: Sloj podataka — tipovi i repozitorij

**Files:**
- Create: `lib/admin/tipovi.ts` ✅ GOTOVO
- Create: `lib/admin/repozitorij.ts` ✅ GOTOVO

**Interfaces:**
- Produces: `Narudzba`, `StatusNarudzbe`, `STATUSI`, `StavkaNarudzbe`, `Postavke`, `PODRAZUMIJEVANE_POSTAVKE`, `AdminPodaci`; `ucitajSve()`, `sacuvajProizvode()`, `sacuvajNarudzbe()`, `sacuvajPostavke()`, `vratiNaPocetno()`

- [x] **Korak 1: Tipovi** — `lib/admin/tipovi.ts` s pet statusa i `STATUSI` listom za dropdown
- [x] **Korak 2: Repozitorij** — sve funkcije `async`, komentar na vrhu koji tačno kaže koji poziv zamijeniti kojom rutom
- [x] **Korak 3: Provjera** — `npx tsc --noEmit` prolazi

### Task 2: Odvajanje admina od javnog sajta

**Files:**
- Modify: `app/layout.tsx` ✅ GOTOVO
- Create: `app/(shop)/layout.tsx` ✅ GOTOVO
- Move: sve javne stranice u `app/(shop)/` ✅ GOTOVO

- [x] **Korak 1:** Premjestiti `page.tsx`, `shop/`, `korpa/`, `naplata/`, `favoriti/`, `prijava/`, `registracija/`, `o-nama/`, `proizvod/` u `app/(shop)/`
- [x] **Korak 2:** Root layout zadržava samo `<html>`, `<body>` i fontove
- [x] **Korak 3:** `(shop)/layout.tsx` preuzima `StoreProvider`, `Ticker`, `Header`, `MobileMenu`, `Footer`, `CartDrawer`, `SearchModal`, `Toaster`
- [x] **Korak 4: Provjera** — `rm -rf .next && npm run build`; sve rute moraju ostati na istim URL-ovima (route grupa ne ulazi u putanju)

### Task 3: AdminProvider i demo narudžbe

**Files:**
- Create: `lib/admin/store.tsx`
- Create: `lib/admin/demo.ts`

**Interfaces:**
- Consumes: sve iz Taska 1
- Produces: `AdminProvider`, `useAdmin()` po `AdminCtx` iznad; `generisiDemoNarudzbe(proizvodi: Product[]): Narudzba[]`

- [ ] **Korak 1: `demo.ts`** — šest narudžbi s bosanskim imenima i gradovima (Sarajevo, Tuzla, Mostar, Banja Luka, Zenica, Bihać), datumi unazad 1–20 dana, statusi raspoređeni po svim vrijednostima, stavke uzete iz stvarnog kataloga. Bez `Math.random()` na vrhu modula — generisati unutar funkcije da SSR i klijent ne razilaze.

- [ ] **Korak 2: `store.tsx`** — Context s `useState` za tri kolekcije. Učitavanje u `useEffect` s praznim nizom zavisnosti (isti obrazac kao `lib/store.tsx`, uključujući `eslint-disable` blok uz objašnjenje). Ako `narudzbe` iz repozitorija dođu prazne, popuniti demo narudžbama i odmah ih sačuvati.

- [ ] **Korak 3: Operacije** — svaka mijenja `useState` pa poziva odgovarajući `sacuvaj*`; nikad ne čeka `await` prije `setState`, jer UI ne smije čekati pohranu:

```ts
function dodajProizvod(p: Product) {
  setProizvodi((prev) => {
    const sljedeci = [p, ...prev];
    void sacuvajProizvode(sljedeci);
    return sljedeci;
  });
  postaviPoruku("Proizvod dodan");
}
```

- [ ] **Korak 4: Poruka** — `poruka` se sama briše nakon 2.5s preko `setTimeout` u `postaviPoruku`; čistiti tajmer pri odmontiranju

- [ ] **Korak 5: Provjera** — `npx tsc --noEmit` i `npm run lint` prolaze

### Task 4: AdminShell — navigacija

**Files:**
- Create: `components/admin/AdminShell.tsx`
- Create: `app/admin/layout.tsx`

**Interfaces:**
- Consumes: `useAdmin()`
- Produces: `AdminShell` koji omotava `children`

- [ ] **Korak 1: Stavke navigacije** — Ploča `/admin`, Proizvodi `/admin/proizvodi`, Narudžbe `/admin/narudzbe`, Postavke `/admin/postavke`; svaka sa svojom ikonom iz `Icons.tsx`
- [ ] **Korak 2: Desktop** — fiksni sidebar 232px, tamna pozadina `bg-ink`, logo „BRANDLAB / ADMIN” na vrhu, aktivna stavka označena kobalt lijevom ivicom; dno sidebara: link „Nazad na sajt” → `/`
- [ ] **Korak 3: Mobitel** — sidebar se skriva; fiksna donja traka s četiri ikone i oznakama, `pb-safe` razmak; sadržaj dobija `pb-20`
- [ ] **Korak 4: Zaglavlje sadržaja** — traka koja jasno kaže: „Demo — izmjene se čuvaju u ovom browseru i ne mijenjaju javni sajt.”
- [ ] **Korak 5: Poruka o uspjehu** — `poruka` iz konteksta prikazana kao traka pri dnu desno, kobalt lijeva ivica
- [ ] **Korak 6: `app/admin/layout.tsx`** — `<AdminProvider><AdminShell>{children}</AdminShell></AdminProvider>`; `export const metadata = { title: { default: "Admin", template: "%s — Admin" } }`
- [ ] **Korak 7: Provjera** — `/admin` se otvara bez tickera i headera javnog sajta; navigacija radi na 375 i 1440

### Task 5: Nadzorna ploča

**Files:**
- Create: `app/admin/page.tsx`
- Create: `components/admin/StatKartica.tsx`

**Interfaces:**
- Consumes: `useAdmin()`
- Produces: `StatKartica({ oznaka, vrijednost, napomena })`

- [ ] **Korak 1: `StatKartica`** — okvir `border border-line`, `.label-tech` oznaka, velika brojka u `.h-display`, sitna napomena ispod
- [ ] **Korak 2: Četiri brojke** — ukupno proizvoda; koliko na sniženju; broj narudžbi; zbir `ukupno` svih narudžbi koje nisu `otkazana`, formatiran kroz `cijenaKM`
- [ ] **Korak 3: Zadnjih pet narudžbi** — tabela: broj, kupac, datum, status (`StatusZnak`), iznos; red vodi na detalj
- [ ] **Korak 4: Brze akcije** — dugmad „Novi proizvod” → `/admin/proizvodi/novi` i „Sve narudžbe” → `/admin/narudzbe`
- [ ] **Korak 5: Provjera** — brojke se poklapaju s podacima; ploča radi i kad nema narudžbi

### Task 6: Lista proizvoda

**Files:**
- Create: `app/admin/proizvodi/page.tsx`
- Create: `components/admin/PraznoStanje.tsx`
- Create: `components/admin/Potvrda.tsx`

**Interfaces:**
- Produces: `PraznoStanje({ ikona, naslov, opis, akcija })`, `Potvrda({ naslov, opis, potvrdiTekst, onPotvrdi, onOdustani })`

- [ ] **Korak 1: Pretraga i filter** — polje za pretragu (koristi `normalizuj` iz `lib/format.ts` da radi bez dijakritike) i padajući izbornik kategorije; oboje u `useState`, filtriranje u `useMemo`
- [ ] **Korak 2: Tabela na desktopu** — kolone: slika 40×53, naziv + kategorija, cijena (stara precrtana), veličine, oznake NOVO/ISTAKNUTO, akcije (uredi, obriši)
- [ ] **Korak 3: Kartice na mobitelu** — ista informacija složena okomito; tabela skrivena ispod `lg`
- [ ] **Korak 4: Brisanje** — `Potvrda` dijalog s nazivom proizvoda u tekstu; tek na potvrdu poziva `obrisiProizvod`
- [ ] **Korak 5: Prazna stanja** — dva različita teksta: nema proizvoda uopšte, i nema rezultata pretrage (s dugmetom za poništavanje)
- [ ] **Korak 6: Provjera** — pretraga „duks” i „sorc” daju očekivano; brisanje traži potvrdu i uklanja red

### Task 7: Forma proizvoda

**Files:**
- Create: `components/admin/ProizvodForma.tsx`
- Create: `app/admin/proizvodi/novi/page.tsx`
- Create: `app/admin/proizvodi/[slug]/page.tsx`

**Interfaces:**
- Consumes: `useAdmin()`, `KATEGORIJE`, `SVE_VELICINE`
- Produces: `ProizvodForma({ pocetni?: Product, onSacuvaj: (p: Product) => void })`

- [ ] **Korak 1: Polja** — naziv, slug, kategorija, cijena, stara cijena, boja, opis, materijal, održavanje, veličine (čipovi, više izbora), slike (lista putanja + izbor iz postojećih u `public/products/`), prekidači novo/istaknuto
- [ ] **Korak 2: Slug** — automatski iz naziva dok korisnik ne dirne polje ručno; koristiti `normalizuj` pa zamijeniti razmake crticom
- [ ] **Korak 3: Validacija** — obavezni: naziv, slug, cijena > 0, bar jedna veličina, bar jedna slika; slug mora biti jedinstven (osim kod izmjene samog sebe); poruke uz polja preko `role="alert"`
- [ ] **Korak 4: Pretpregled** — kartica desno koja uživo pokazuje kako će proizvod izgledati u shopu (slika, naziv, cijena, badge)
- [ ] **Korak 5: Nova stranica** — prazna forma, na spremanje `dodajProizvod` pa `router.push("/admin/proizvodi")`
- [ ] **Korak 6: Izmjena** — `params.slug` (await, Next 16), `nadjiPoSlugu`; ako nema — `PraznoStanje` s povratkom na listu; na spremanje `izmijeniProizvod`
- [ ] **Korak 7: Provjera** — dodati proizvod, vidjeti ga u listi, urediti mu cijenu, provjeriti da promjena ostaje nakon reloada

### Task 8: Narudžbe

**Files:**
- Create: `app/admin/narudzbe/page.tsx`
- Create: `app/admin/narudzbe/[id]/page.tsx`
- Create: `components/admin/StatusZnak.tsx`

**Interfaces:**
- Produces: `StatusZnak({ status })`

- [ ] **Korak 1: `StatusZnak`** — boje: nova kobalt, u-obradi ink, poslana steel okvir, isporučena zelena `#127A3E`, otkazana precrtano sivo
- [ ] **Korak 2: Lista** — filter po statusu (dugmad s brojačima), sortiranje po datumu opadajuće; kolone: broj, kupac, grad, datum, stavke (broj komada), iznos, status
- [ ] **Korak 3: Detalj** — podaci kupca, adresa, tabela stavki sa slikama, sažetak iznosa, padajući izbornik za promjenu statusa koji odmah sprema
- [ ] **Korak 4: Brisanje narudžbe** — kroz `Potvrda`
- [ ] **Korak 5: Prazno stanje** — kad nema narudžbi u odabranom filteru
- [ ] **Korak 6: Provjera** — promjena statusa se vidi u listi i opstaje nakon reloada

### Task 9: Postavke

**Files:**
- Create: `app/admin/postavke/page.tsx`

- [ ] **Korak 1: Dostava** — tri numerička polja: prag besplatne dostave, cijena dostave, doplata za brzu; validacija da su ≥ 0
- [ ] **Korak 2: Ticker poruke** — lista tekstualnih polja s dugmadima za dodavanje i uklanjanje; bar jedna mora ostati
- [ ] **Korak 3: Spremanje** — jedno dugme koje zove `izmijeniPostavke`, uz potvrdnu poruku
- [ ] **Korak 4: Vraćanje na početno** — odvojena sekcija s crvenkastim okvirom, `Potvrda` dijalog, zove `resetuj()`
- [ ] **Korak 5: Provjera** — izmjena praga se vidi nakon reloada; reset vraća katalog na 24 proizvoda

### Task 10: Finalna provjera

- [ ] **Korak 1:** `npx tsc --noEmit` — bez grešaka
- [ ] **Korak 2:** `npm run lint` — bez grešaka i upozorenja
- [ ] **Korak 3:** `npm run build` — prolazi, sve admin rute u ispisu
- [ ] **Korak 4:** Playwright kroz `/admin`, `/admin/proizvodi`, `/admin/proizvodi/novi`, `/admin/narudzbe`, `/admin/postavke` na 375 / 768 / 1440 — provjeriti `scrollWidth <= clientWidth` na svakoj
- [ ] **Korak 5:** Tok kroz browser: dodaj proizvod → uredi ga → obriši; promijeni status narudžbe; izmijeni postavke; reload i potvrdi da sve stoji
- [ ] **Korak 6:** Potvrditi da javni sajt i dalje radi netaknut (`/`, `/shop`, `/korpa`)

## Self-Review

**Pokrivenost zahtjeva:**
- „proizvodi” → Task 6 (lista, brisanje) + Task 7 (dodavanje, izmjena) ✓
- „narudžbe” → Task 8 ✓
- „nadzorna ploča” → Task 5 ✓
- „postavke” → Task 9 ✓
- „da nije sporo” → Task 3 korak 3: operacije nad memorijom, upis kao nusefekat, bez `await` prije `setState` ✓
- „da nije komplikovano” → Task 4: četiri stavke u navigaciji, ništa ugniježđeno dublje od dva nivoa ✓
- „kasnije backend” → Task 1: repozitorij kao jedina tačka dodira, s uputom koji poziv čime zamijeniti ✓

**Placeholderi:** nema „TBD” ni „dodaj validaciju” bez navođenja pravila — Task 7 korak 3 i Task 9 korak 1 navode tačna pravila.

**Konzistentnost tipova:** `AdminCtx` metode korištene u taskovima 5–9 poklapaju se s potpisima iz Interfaces sekcije; `Narudzba.id` je `string` i tako se koristi u ruti `[id]`; `StatusNarudzbe` vrijednosti u `StatusZnak` (Task 8) poklapaju se s `STATUSI` iz Taska 1.
