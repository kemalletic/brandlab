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
| `/prijava`, `/registracija` | Demo forme za račun |
| `/admin` | Nadzorna ploča — brojke i zadnje narudžbe |
| `/admin/proizvodi` | Katalog: pretraga, filter, dodavanje, izmjena, brisanje |
| `/admin/narudzbe` | Narudžbe: filter po statusu, detalj, promjena statusa |
| `/admin/postavke` | Dostava, poruke u traci, vraćanje na početno |

## Struktura

```
app/
  (shop)/       Javni sajt — vlastiti layout s tickerom, headerom i korpom.
  admin/        Admin — vlastiti layout sa sidebarom, bez javnog chromea.
                Route grupa (shop) ne ulazi u URL: /shop je i dalje /shop.
components/
  admin/        Komponente admina (shell, tabele, forma, dijalozi).
  home/         Sekcije početne stranice.
  Icons.tsx     Sve ikone kao stroke SVG — nikad Unicode znakovi.
lib/
  products.ts   Katalog — 24 proizvoda, 6 kategorija, sve na jednom mjestu.
  store.tsx     Korpa, favoriti i toast poruke (Context + localStorage).
  format.ts     Cijene, datumi i normalizacija teksta za pretragu.
  types.ts      Tipovi Product i Kategorija.
  admin/
    repozitorij.ts  Jedina tačka dodira s pohranom — ovdje ide backend.
    store.tsx       AdminProvider: stanje i sve operacije.
    tipovi.ts       Narudzba, Postavke, StatusNarudzbe.
    demo.ts         Demo narudžbe da ploča nije prazna.
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

## Admin

Admin je na `/admin` i upravlja proizvodima, narudžbama i postavkama. Podaci
se učitaju jednom pri ulasku, a svaka akcija radi nad nizom u memoriji — upis
u pohranu ide kao nusefekat i ne blokira UI, pa nema čekanja između klikova.

Izmjene se trenutno čuvaju u `localStorage` i **ne** mijenjaju javni sajt.
Javne stranice ostaju statične i čitaju `lib/products.ts`.

### Kad dođe backend

Sav pristup podacima prolazi kroz `lib/admin/repozitorij.ts` — jedini fajl
koji zna gdje podaci stoje. Funkcije su već `Promise`-based, pa se prelazak
svodi na izmjenu tog jednog fajla; nijedna komponenta ne zna odakle podaci
dolaze:

```
ucitajSve()        → GET  /api/admin/podaci
sacuvajProizvode() → PUT  /api/admin/proizvodi
sacuvajNarudzbe()  → PUT  /api/admin/narudzbe
sacuvajPostavke()  → PUT  /api/admin/postavke
```

Tada bi javne stranice čitale iz iste baze, pa bi admin izmjene bile vidljive
svima. Admin nema autentikaciju — nju treba dodati uz backend.

## Šta nije uključeno

Demo je frontend — nema backend, bazu ni pravu naplatu. Narudžba na `/naplata`
generiše broj i prazni korpu, ali se nigdje ne šalje niti završava u adminu.
Prijava i registracija su forme bez pravih računa.

## Fotografije

Fotografije su s [Unsplasha](https://unsplash.com) pod njihovom besplatnom
licencom i služe kao privremeni sadržaj. Prije objave zamijeni ih vlastitim
snimcima proizvoda.
