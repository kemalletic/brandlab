# BRANDLAB

Web shop za mušku uličnu odjeću. Moderan, urban, sportsko-minimalistički dizajn
u kobalt plavoj, crnoj i bijeloj. Sadržaj na bosanskom jeziku.

## Pokretanje

```bash
npm install
npm run dev
```

Otvori http://localhost:3000.

Ako fotografije nedostaju (npr. nakon svježeg kloniranja bez `public/products/`):

```bash
node scripts/download-images.mjs
```

Skripta skida 35 fotografija s Unsplasha i provjerava svaku (HTTP status, tip,
minimalna veličina). Izlazi s kodom 1 ako ijedna ne prođe.

## Skripte

| Naredba | Šta radi |
|---|---|
| `npm run dev` | Razvojni server |
| `npm run build` | Produkcijski build |
| `npm start` | Pokreće produkcijski build |
| `npm run lint` | ESLint |

## Stranice

| Ruta | Sadržaj |
|---|---|
| `/` | Hero, kategorije, novi drop, lookbook, priča brenda, newsletter |
| `/shop` | Svi proizvodi — filteri (kategorija, veličina, cijena) i sortiranje |
| `/proizvod/[slug]` | Galerija, izbor veličine, dodavanje u korpu, srodni proizvodi |
| `/korpa` | Stavke, količine, sažetak s dostavom |
| `/naplata` | Tri koraka: podaci → dostava → plaćanje, pa potvrda narudžbe |
| `/favoriti` | Sačuvani proizvodi |
| `/o-nama` | Priča brenda |

## Struktura

```
app/            Rute (App Router). Client stranice su odvojene u *Client.tsx
                da bi server page.tsx mogao izvoziti metadata.
components/     Zajedničke komponente; components/home/ su sekcije početne.
lib/
  products.ts   Katalog — 22 proizvoda, 6 kategorija, sve na jednom mjestu.
  store.tsx     Korpa, favoriti i toast poruke (Context + localStorage).
  format.ts     Formatiranje cijena i normalizacija teksta za pretragu.
  types.ts      Tipovi Product i Kategorija.
scripts/        Skidanje fotografija.
```

## Dizajn sistem

Tokeni su u `app/globals.css` unutar `@theme` bloka:

- **Boje** — `cobalt` `#0038FF` (akcent, koristi se štedljivo), `ink` `#0A0A0A`,
  `paper` `#FFFFFF`, plus `smoke`, `steel`, `line` za pozadine, sekundarni tekst
  i okvire.
- **Fontovi** — Archivo (naslovi, `.h-display` i `.h-display-narrow`) i Inter
  (tekst i UI). Oba s `latin-ext` subsetom zbog č ć ž š đ.
- **Oblik** — bez zaobljenja, osim 2px na poljima za unos.
- **Animacije** — marquee traka, scroll-reveal (`components/Reveal.tsx`),
  slide-in za panele. Sve poštuje `prefers-reduced-motion`.

## Stanje aplikacije

`StoreProvider` u `lib/store.tsx` drži korpu i favorite i upisuje ih u
`localStorage` (`brandlab.cart`, `brandlab.wishlist`). Hidracija se radi u
`useEffect` nakon montiranja, pa server i klijent renderuju isto pri prvom
prolazu. Komponente koje prikazuju brojeve iz korpe čekaju `hydrated` prije
prikaza.

## Šta nije uključeno

Demo je frontend — nema backend, bazu ni pravu naplatu. Narudžba na `/naplata`
generiše broj i prazni korpu, ali se nigdje ne šalje. Nema korisničkih računa.
Podaci o proizvodima su statični u `lib/products.ts`.

Struktura je pripremljena da se ovo doda bez preslagivanja: katalog ima jasan
tip (`Product`), a stanje korpe je izolovano u jednom kontekstu.

## Fotografije

Fotografije su s [Unsplasha](https://unsplash.com) pod njihovom besplatnom
licencom i služe kao privremeni sadržaj. Prije objave zamijeni ih vlastitim
snimcima proizvoda.
