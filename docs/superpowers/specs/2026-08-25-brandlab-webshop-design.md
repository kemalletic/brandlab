# BRANDLAB — Muški streetwear web shop — Dizajn dokument

**Datum:** 2026-08-25
**Status:** Odobreno od korisnika (chat, 2026-08-25)

## 1. Cilj

Moderan web shop za mušku odjeću, vizuelno na nivou vodećih streetwear brendova
2026 (Represent, Fear of God, Nike ACG, Arte Antwerp). Urban, sportski,
minimalistički — bez kiča i vizuelne buke. Sadržaj na bosanskom jeziku.
Puni frontend demo: sve funkcije rade (korpa, wishlist, filteri, pretraga,
checkout forma), bez prave naplate i baze — spremno za kasnije spajanje na backend.

## 2. Brend identitet

- **Ime:** BRANDLAB (izbor korisnika)
- **Paleta:**
  - Kobalt plava `#0038FF` — akcentna boja, koristi se štedljivo: CTA dugmad,
    hover stanja, badge-ovi, ticker, aktivni linkovi
  - Crna `#0A0A0A` — primarna pozadina tamnih sekcija, tekst
  - Bijela `#FFFFFF` — primarna pozadina svijetlih sekcija
  - Sive nijanse za sekundarni tekst, bordere, placeholder pozadine
- **Tipografija (next/font/google, latin-ext zbog č ć ž š đ):**
  - **Archivo** (variable, širina Expanded za naslove) — veliki UPPERCASE
    kondenzovano-prošireni naslovi, uski letter-spacing
  - **Inter** — body tekst, UI elementi
- **Vizuelni jezik:** oštre ivice (bez border-radiusa osim minimalnog na
  inputima), grid layout, marquee ticker traka, mikro-animacije na hover
  (scale slike, underline linkova), scroll-reveal animacije (IntersectionObserver),
  "NOVO" / "-XX%" badge-ovi, veliki brojevi i statistike, puno negativnog prostora.

## 3. Tehnologija

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS v4**
- Bez dodatnih runtime biblioteka (animacije čisti CSS + IntersectionObserver)
- **Stanje:** React Context (`StoreProvider`) + `localStorage` perzistencija
  za korpu i wishlist
- **Slike:** kurirane Unsplash fotografije (besplatna licenca) skinute lokalno
  u `public/products/` — sajt radi offline; `next/image` za optimizaciju
- **Podaci:** `lib/products.ts` — ~20 proizvoda, 6 kategorija
  (duksevi, majice, jakne, pantalone, šorcevi, dodaci); svaki proizvod:
  slug, naziv, kategorija, cijena, stara cijena (opciono), veličine, boje,
  opis, materijali, više slika, flagovi (novo, akcija, istaknuto)

## 4. Stranice i rute

| Ruta | Sadržaj |
|---|---|
| `/` | Hero (full-bleed slika + veliki naslov + CTA), marquee ticker, kategorije grid, "Novi drop" proizvodi, lookbook traka, brend statistika/priča, newsletter, footer |
| `/shop` | Grid proizvoda s filterima (kategorija, veličina, raspon cijene), sortiranje (novo, cijena ↑↓), brojač rezultata; filteri kao sidebar na desktopu, drawer na mobitelu; query param za kategoriju |
| `/proizvod/[slug]` | Galerija slika, naziv/cijena/badge, izbor veličine (obavezan prije dodavanja), dodaj u korpu + wishlist, harmonika sekcije (opis, materijali, dostava), srodni proizvodi |
| `/korpa` | Stranica korpe: stavke (slika, veličina, količina +/-, ukloni), sažetak (međuzbir, dostava, ukupno), CTA na naplatu; prazna korpa stilizovana |
| `/naplata` | Višekoračna demo forma: podaci → dostava → plaćanje (demo) → potvrda narudžbe s brojem; validacija polja |
| `/favoriti` | Grid sačuvanih proizvoda, prazno stanje stilizovano |
| `/o-nama` | Brend priča, vrijednosti, velike slike |
| `not-found` | Stilizovana 404 |

**Globalne komponente:** sticky Header (transparentan na vrhu home-a, solid na
scroll; hamburger + full-screen meni na mobitelu), CartDrawer (klizni panel
zdesna, otvara se na dodavanje), SearchModal (fuzzy pretraga po nazivu/kategoriji),
Footer (linkovi, newsletter, social), Toast notifikacije ("Dodano u korpu").

## 5. Responsivnost

Mobile-first. Breakpointi Tailwind default (sm 640, md 768, lg 1024, xl 1280).
Na mobitelu: hamburger meni, filter drawer, 2-kolonski grid proizvoda,
touch-friendly dugmad (min 44px), bottom-sticky "Dodaj u korpu" na stranici
proizvoda. Testiranje na 375px, 768px, 1440px širinama (Playwright screenshots).

## 6. Van opsega (YAGNI)

Prava naplata (Stripe), korisnički računi/login, backend/baza, CMS, i18n
višejezičnost, recenzije korisnika. Struktura podataka i konteksta dizajnirana
da se ovo kasnije doda bez restrukturiranja.

## 7. Testiranje / verifikacija

- `npm run build` prolazi bez grešaka (TypeScript strict)
- Playwright vizuelna provjera svake stranice na 3 širine ekrana
- Ručna provjera tokova: dodavanje u korpu → izmjena količine → checkout →
  potvrda; wishlist toggle; filteri i sortiranje; pretraga; perzistencija
  nakon reload-a
