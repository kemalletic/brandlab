// Skida fotografije koje BRANDLAB koristi u public/products/.
// Sve slike su s Unsplasha (besplatna licenca). Svaki fajl se provjerava:
// HTTP 200, content-type image/*, veličina veća od 20 KB.
//
// Pokretanje: node scripts/download-images.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/products");

// [izlazno ime, unsplash photo id, širina]
const SLIKE = [
  ["dodatak-01.jpg", "photo-1556306535-0f09a537f0a3", 1400],
  ["dodatak-03.jpg", "photo-1622560480605-d83c853bc5c3", 1400],
  ["dodatak-04.jpg", "photo-1553062407-98eeb64c6a62", 1400],
  ["dodatak-05.jpg", "photo-1588850561407-ed78c282e89b", 1400],
  ["dodatak-07.jpg", "photo-1576871337622-98d48d1cf531", 1400],
  ["duks-01.jpg", "photo-1556821840-3a63f95609a7", 1400],
  ["duks-02.jpg", "photo-1611312449408-fcece27cdbb7", 1400],
  ["duks-05.jpg", "photo-1618517351616-38fb9c5210c6", 1400],
  ["duks-06.jpg", "photo-1509942774463-acf339cf87d5", 1400],
  ["duks-08.jpg", "photo-1614975059251-992f11792b9f", 1400],
  ["duks-10.jpg", "photo-1578681994506-b8f463449011", 1400],
  ["duks-11.jpg", "photo-1622519407650-3df9883f76a5", 1400],
  ["hero-01.jpg", "photo-1488161628813-04466f872be2", 2000],
  ["hero-02.jpg", "photo-1531891437562-4301cf35b7e4", 2000],
  ["jakna-01.jpg", "photo-1551028719-00167b16eac5", 1400],
  ["jakna-02.jpg", "photo-1591047139829-d91aecb6caea", 1400],
  ["jakna-04.jpg", "photo-1548126032-079a0fb0099d", 1400],
  ["kapa-01.jpg", "photo-1521369909029-2afed882baee", 1400],
  ["look-01.jpg", "photo-1552374196-1ab2a1c593e8", 1600],
  ["look-03.jpg", "photo-1507003211169-0a1dd7228f2d", 1600],
  ["look-05.jpg", "photo-1520975954732-35dd22299614", 1600],
  ["look-06.jpg", "photo-1441984904996-e0b6ba687e04", 1600],
  ["look-08.jpg", "photo-1523398002811-999ca8dec234", 1600],
  ["majica-01.jpg", "photo-1521572163474-6864f9cf17ab", 1400],
  ["majica-02.jpg", "photo-1576566588028-4147f3842f27", 1400],
  ["majica-03.jpg", "photo-1618354691373-d851c5c3a990", 1400],
  ["majica-07.jpg", "photo-1562157873-818bc0726f68", 1400],
  ["naocale-01.jpg", "photo-1511499767150-a48a237f0083", 1400],
  ["pantalone-01.jpg", "photo-1542272604-787c3835535d", 1400],
  ["pantalone-02.jpg", "photo-1473966968600-fa801b869a1a", 1400],
  ["pantalone-03.jpg", "photo-1624378439575-d8705ad7ae80", 1400],
  ["patike-01.jpg", "photo-1552346154-21d32810aba3", 1400],
  ["patike-02.jpg", "photo-1600185365483-26d7a4cc7519", 1400],
  ["patike-06.jpg", "photo-1512374382149-233c42b6a83b", 1400],
  ["sorc-05.jpg", "photo-1584865288642-42078afe6942", 1400],
];

await mkdir(OUT, { recursive: true });

const ok = [];
const fail = [];

for (const [name, id, w] of SLIKE) {
  const url = `https://images.unsplash.com/${id}?q=80&w=${w}&fm=jpg&fit=crop`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/")) {
      fail.push(`${name} — HTTP ${res.status}, tip ${type}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 20_000) {
      fail.push(`${name} — premala (${buf.byteLength} B)`);
      continue;
    }
    await writeFile(path.join(OUT, name), buf);
    ok.push(`${name} — ${(buf.byteLength / 1024).toFixed(0)} KB`);
  } catch (err) {
    fail.push(`${name} — ${err.message}`);
  }
}

console.log(`Skinuto (${ok.length}):`);
for (const line of ok) console.log("  " + line);
if (fail.length > 0) {
  console.log(`Neuspjelo (${fail.length}):`);
  for (const line of fail) console.log("  " + line);
}
process.exitCode = fail.length > 0 ? 1 : 0;
