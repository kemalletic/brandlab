# BRANDLAB Webshop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Moderan muški streetwear web shop (BRANDLAB) — puni frontend demo sa korpom, wishlistom, filterima, pretragom i checkout tokom, sadržaj na bosanskom.

**Architecture:** Next.js 15 App Router aplikacija; sav sadržaj statičan iz `lib/products.ts`; klijentsko stanje (korpa/wishlist/toast) u jednom React Contextu sa localStorage perzistencijom; dizajn sistem definisan kroz Tailwind v4 `@theme` tokene.

**Tech Stack:** Next.js 15, TypeScript (strict), Tailwind CSS v4, next/font (Archivo + Inter, latin-ext), next/image, Playwright (verifikacija).

**Spec:** `docs/superpowers/specs/2026-08-25-brandlab-webshop-design.md`

## Global Constraints

- **BEZ GIT COMMITOVA** — korisnik je izričito zabranio commitovanje (napomena 2026-08-25).
- Boje: kobalt plava `#0038FF`, crna `#0A0A0A`, bijela `#FFFFFF`; plava samo kao akcenat.
- Fontovi: Archivo (naslovi, UPPERCASE, expanded width) + Inter (body); subset `latin-ext` (č ć ž š đ).
- Sav UI tekst na bosanskom.
- Oštre ivice — bez `border-radius` osim minimalnog (2px) na form inputima.
- Mobile-first; touch mete min 44px; testne širine 375 / 768 / 1440.
- Bez dodatnih runtime npm paketa mimo Next/React/Tailwind.
- Slike lokalno u `public/products/`; `next/image` svugdje.
- Rute i nazivi fajlova tačno kako su navedeni u tabeli speca (`/shop`, `/proizvod/[slug]`, `/korpa`, `/naplata`, `/favoriti`, `/o-nama`).

## File Structure

```
app/
  layout.tsx          # fontovi, StoreProvider, Header, Footer, CartDrawer, SearchModal, Toaster
  globals.css         # Tailwind v4 @theme tokeni, keyframes, utility klase
  page.tsx            # početna
  shop/page.tsx       # listing + filteri (client)
  proizvod/[slug]/page.tsx  # server wrapper + generateStaticParams
  proizvod/[slug]/ProductView.tsx  # client detalj
  korpa/page.tsx
  naplata/page.tsx    # višekoračni checkout (client)
  favoriti/page.tsx
  o-nama/page.tsx
  not-found.tsx
components/
  Header.tsx  MobileMenu.tsx  Footer.tsx  Ticker.tsx
  CartDrawer.tsx  SearchModal.tsx  Toaster.tsx
  ProductCard.tsx  ProductGrid.tsx  Reveal.tsx  (scroll-reveal wrapper)
  home/Hero.tsx  home/Categories.tsx  home/NewDrop.tsx  home/Lookbook.tsx  home/BrandStory.tsx  home/Newsletter.tsx
lib/
  types.ts  products.ts  store.tsx  format.ts
public/products/*.jpg
scripts/download-images.mjs
```

## Interfaces (globalno — sve taskove obavezuju)

```ts
// lib/types.ts
export type Kategorija = "duksevi" | "majice" | "jakne" | "pantalone" | "sorcevi" | "dodaci";
export interface Product {
  slug: string; naziv: string; kategorija: Kategorija;
  cijena: number; staraCijena?: number;          // KM
  velicine: string[]; boja: string;
  opis: string; materijal: string;
  slike: string[];                                // putanje /products/x.jpg
  novo?: boolean; istaknuto?: boolean;
}
// lib/store.tsx
export interface CartItem { slug: string; velicina: string; kolicina: number; }
interface StoreCtx {
  cart: CartItem[]; wishlist: string[];
  cartOpen: boolean; searchOpen: boolean; menuOpen: boolean;
  addToCart(slug: string, velicina: string): void;
  updateQty(slug: string, velicina: string, delta: number): void;
  removeFromCart(slug: string, velicina: string): void;
  clearCart(): void;
  toggleWishlist(slug: string): void;
  setCartOpen(v: boolean): void; setSearchOpen(v: boolean): void; setMenuOpen(v: boolean): void;
  toast(msg: string): void;
}
export function useStore(): StoreCtx;   // throw izvan providera
// lib/format.ts
export function cijenaKM(n: number): string;  // "129,00 KM"
```

---

### Task 1: Scaffold + dizajn tokeni

**Files:** Create: Next.js scaffold (create-next-app u temp folder pa premjestiti jer dir nije prazan), `app/globals.css`, `app/layout.tsx` (fontovi)

- [ ] Scaffold: `npx create-next-app@latest brandlab-tmp --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes` pa premjestiti sadržaj u root (zadržati postojeći `.claude`, `docs`, `.git`)
- [ ] `globals.css`: `@theme` tokeni — `--color-cobalt: #0038FF`, `--color-ink: #0A0A0A`, spacing/tracking skala; keyframes `marquee`, `reveal`, `slide-in`; utility `.btn-primary`, `.btn-ghost`, `.h-display`
- [ ] `layout.tsx`: Archivo variable (axes width) + Inter preko `next/font/google`, subsets `["latin","latin-ext"]`, CSS varijable `--font-display`, `--font-sans`; metadata (title template "%s — BRANDLAB", opis na bosanskom); `lang="bs"`
- [ ] Verifikacija: `npm run dev` renderuje bez grešaka

### Task 2: Podaci + slike

**Files:** Create: `lib/types.ts`, `lib/products.ts`, `lib/format.ts`, `scripts/download-images.mjs`, `public/products/*.jpg`

- [ ] Tipovi i format helper po Interfaces sekciji
- [ ] ~20 proizvoda kroz 6 kategorija; bosanski nazivi ("Oversized duks BRANDLAB 01", "Cargo pantalone Track"...); cijene 19–299 KM; 4-6 s `novo`, 4 s `staraCijena` (akcija), 4 `istaknuto`; 2-3 slike po proizvodu
- [ ] Download skripta: lista kuriranih Unsplash URL-ova → `public/products/`; provjeri HTTP 200 i veličinu > 20KB; ispiši failове; za promašaje zamijeniti URL ili napraviti brandirani SVG placeholder
- [ ] Verifikacija: svi fajlovi postoje, `node` skripta izlazi bez failova

### Task 3: Store context

**Files:** Create: `lib/store.tsx`; Modify: `app/layout.tsx` (omotati `StoreProvider`)

- [ ] Implementirati `StoreCtx` po Interfaces sekciji; localStorage ključevi `brandlab.cart`, `brandlab.wishlist`; hidracija u `useEffect` (bez SSR mismatch); toast queue (id + poruka, auto-dismiss 2.5s)
- [ ] `addToCart` postojećoj kombinaciji slug+veličina povećava količinu; otvara CartDrawer i šalje toast
- [ ] Verifikacija: privremena test stranica ili konzola — add/update/remove/persistencija nakon reload

### Task 4: Globalni chrome — Header, MobileMenu, Footer, Ticker, CartDrawer, SearchModal, Toaster

**Files:** Create: `components/Header.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `Ticker.tsx`, `CartDrawer.tsx`, `SearchModal.tsx`, `Toaster.tsx`, `Reveal.tsx`; Modify: `app/layout.tsx`

- [ ] Header: sticky; na `/` transparentan preko heroja → solid bijeli na scroll (IntersectionObserver/scroll listener); logo "BRANDLAB®" Archivo expanded; nav: Shop, Novo, Kolekcije (na kategorije), O nama; ikone: pretraga, favoriti (badge broj), korpa (badge broj); hamburger < lg
- [ ] MobileMenu: full-screen overlay, velike stavke (Archivo, staggered slide-in animacija), linkovi kategorija, zatvaranje na navigaciju
- [ ] Ticker: marquee traka `bg-cobalt` bijeli uppercase tekst ("BESPLATNA DOSTAVA IZNAD 100 KM • NOVI DROP SADA ONLINE • ..."), CSS animacija, pauza na hover
- [ ] CartDrawer: fixed desno, slide-in, backdrop blur; stavke sa slikom/veličinom/qty +/-; međuzbir; CTA "NA NAPLATU" → `/naplata`, sekundarno "Pogledaj korpu" → `/korpa`; Escape i backdrop zatvaraju
- [ ] SearchModal: full-screen top sloj, veliki input, live rezultati (match naziv/kategorija, normalizacija č→c š→s ž→z đ→d), grid do 6 rezultata, Escape zatvara
- [ ] Toaster: fixed dole-centar (mobile) / dole-desno (desktop), crna traka bijeli tekst plavi lijevi border
- [ ] Footer: crna pozadina; 4 kolone (Shop po kategorijama, Pomoć, Brend, Newsletter forma); veliki "BRANDLAB" watermark tekst; social linkovi; sitna slova (© 2026, uslovi)
- [ ] Reveal: IntersectionObserver wrapper — fade+translate-y na ulazu, `once`, prefers-reduced-motion poštuje
- [ ] Verifikacija: sve interakcije rade na 375 i 1440

### Task 5: ProductCard + početna

**Files:** Create: `components/ProductCard.tsx`, `ProductGrid.tsx`, `components/home/*` (Hero, Categories, NewDrop, Lookbook, BrandStory, Newsletter); Modify: `app/page.tsx`

- [ ] ProductCard: slika 3:4 (`object-cover`, hover: druga slika ili scale 1.05), badge "NOVO" (plavi) / "-X%" (crni), wishlist srce (toggle, ispunjeno plavo), naziv, kategorija sitno, cijena (stara precrtana siva); cijeli card link na `/proizvod/[slug]`
- [ ] Hero: full-viewport (100svh minus ticker) tamna fotografija, gradijent overlay, ogroman naslov ("NOVA KOLEKCIJA / JESEN '26" stil), CTA "KUPUJ SADA" (btn-primary plavi) + "POGLEDAJ LOOKBOOK" (ghost bijeli), scroll indikator
- [ ] Categories: grid 2×2 (mobile) / 4 (desktop) foto pločice s uppercase nazivom i hover zoom → `/shop?kategorija=x`
- [ ] NewDrop: naslovna traka ("NOVI DROP" + link "Pogledaj sve"), horizontalni scroll-snap red kartica (mobile) / grid 4 (desktop) proizvoda s `novo`
- [ ] Lookbook: velika full-width slika + editorial tekst preko, sekundarna 2-slike sekcija
- [ ] BrandStory: crna sekcija, statistike velikim brojevima (npr. "2026 / OSNOVAN", "100% / PAMUK", "48h / DOSTAVA"), kratka priča
- [ ] Newsletter: forma (email input + dugme "PRIJAVI SE"), uspjeh = toast; bez backend poziva
- [ ] Sve sekcije u `Reveal`; verifikacija na 3 širine

### Task 6: Shop stranica

**Files:** Create: `app/shop/page.tsx` (+ client `ShopClient.tsx` u istom folderu)

- [ ] Čita `?kategorija=` (useSearchParams u client komponenti, Suspense boundary)
- [ ] Filteri: kategorija (single), veličina (multi), cijena (max slider ili radio rasponi); desktop = lijevi sidebar sticky; mobile = dugme "FILTERI" → bottom/side drawer
- [ ] Sortiranje: Najnovije / Cijena ↑ / Cijena ↓; brojač "X proizvoda"; aktivni filteri kao čipovi s x
- [ ] Prazan rezultat stilizovan ("Nema proizvoda" + reset dugme)
- [ ] Verifikacija: kombinacije filtera + sort + URL kategorija rade

### Task 7: Detalj proizvoda

**Files:** Create: `app/proizvod/[slug]/page.tsx` (server, `generateStaticParams`, `notFound()`), `app/proizvod/[slug]/ProductView.tsx` (client)

- [ ] Layout: galerija lijevo (glavna slika + thumbnails; mobile: horizontalni snap scroll), info desno sticky
- [ ] Info: breadcrumb, naziv (Archivo), cijena + stara, badge; izbor veličine (obavezan — bez izbora dugme disabled + poruka "Odaberi veličinu"); "DODAJ U KORPU" (btn-primary, puna širina) + wishlist dugme; harmonike: Opis / Materijal i održavanje / Dostava i povrat
- [ ] Mobile: sticky bottom bar (cijena + DODAJ U KORPU)
- [ ] Srodni proizvodi: 4 iz iste kategorije (bez trenutnog)
- [ ] Verifikacija: dodavanje s veličinom radi, disabled bez veličine, 404 za nepostojeći slug

### Task 8: Korpa + Naplata

**Files:** Create: `app/korpa/page.tsx`, `app/naplata/page.tsx`

- [ ] Korpa: tabela stavki (slika, naziv→link, veličina, qty +/-, cijena, ukloni ×); sažetak sticky desno (međuzbir, dostava: besplatna ≥100 KM inače 7 KM, UKUPNO), CTA "NA NAPLATU"; prazna korpa: veliki naslov + CTA na shop
- [ ] Naplata: koraci 1. Podaci (ime, prezime, email, telefon, adresa, grad, poštanski broj) → 2. Dostava (standardna/brza radio) → 3. Plaćanje (demo kartica polja + napomena "Demo — bez prave naplate", pouzeće opcija) → 4. Potvrda (broj narudžbe `BL-XXXXXX`, sažetak, clearCart); step indikator; validacija required polja + email format, poruke na bosanskom; sažetak narudžbe u sidebar-u kroz sve korake
- [ ] Verifikacija: cijeli tok od korpe do potvrde; korpa prazna nakon potvrde

### Task 9: Favoriti, O nama, 404

**Files:** Create: `app/favoriti/page.tsx`, `app/o-nama/page.tsx`, `app/not-found.tsx`

- [ ] Favoriti: grid ProductCard iz wishliste; prazno stanje ("Još nema favorita" + CTA)
- [ ] O nama: hero naslov, editorial slike + tekst priče brenda, vrijednosti (3 kolone), CTA na shop
- [ ] 404: ogromna "404" Archivo, "Stranica nije pronađena", CTA nazad
- [ ] Verifikacija: sve tri renderuju na 3 širine

### Task 10: Finalna verifikacija

- [ ] `npm run build` — nula grešaka (TS strict + ESLint)
- [ ] Playwright: screenshot svake rute na 375/768/1440; pregledati svaki — poravnanja, kontrast, overflow
- [ ] Ručni tokovi kroz Playwright: dodaj u korpu → drawer → korpa → naplata → potvrda; wishlist toggle + favoriti; pretraga; filteri; reload persistencija
- [ ] Ispraviti sve nađeno; ponovo build

## Self-Review

- Spec coverage: sve rute iz speca imaju task (1–9), verifikacija = task 10. ✓
- Bez placeholder koraka; interfejsi centralno definisani. ✓
- Tipovi konzistentni (`Product`, `CartItem`, `useStore`). ✓
- Napomena: commitovi izbačeni iz svih koraka po izričitoj zabrani korisnika. ✓
