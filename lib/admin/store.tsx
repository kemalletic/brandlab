"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";
import {
  sacuvajNarudzbe,
  sacuvajPostavke,
  sacuvajProizvode,
  ucitajSve,
  vratiNaPocetno,
} from "./repozitorij";
import { generisiDemoNarudzbe } from "./demo";
import {
  PODRAZUMIJEVANE_POSTAVKE,
  type Narudzba,
  type Postavke,
  type StatusNarudzbe,
} from "./tipovi";

interface AdminCtx {
  proizvodi: Product[];
  narudzbe: Narudzba[];
  postavke: Postavke;
  spremno: boolean;

  dodajProizvod(p: Product): void;
  izmijeniProizvod(slug: string, p: Product): void;
  obrisiProizvod(slug: string): void;
  nadjiPoSlugu(slug: string): Product | undefined;

  postaviStatus(id: string, status: StatusNarudzbe): void;
  obrisiNarudzbu(id: string): void;

  izmijeniPostavke(p: Postavke): void;
  resetuj(): void;

  poruka: string | null;
  postaviPoruku(t: string): void;
}

const Ctx = createContext<AdminCtx | null>(null);

export function useAdmin(): AdminCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin se koristi izvan AdminProvider-a");
  return ctx;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [proizvodi, setProizvodi] = useState<Product[]>([]);
  const [narudzbe, setNarudzbe] = useState<Narudzba[]>([]);
  const [postavke, setPostavke] = useState<Postavke>(PODRAZUMIJEVANE_POSTAVKE);
  const [spremno, setSpremno] = useState(false);
  const [poruka, setPoruka] = useState<string | null>(null);
  const tajmer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Jedno učitavanje pri montiranju; sve dalje radi iz memorije, pa nema
  // čekanja između akcija. Server nema pristup pohrani, zato tek u efektu.
  useEffect(() => {
    let otkazano = false;
    ucitajSve().then((podaci) => {
      if (otkazano) return;
      setProizvodi(podaci.proizvodi);
      setPostavke(podaci.postavke);
      if (podaci.narudzbe.length > 0) {
        setNarudzbe(podaci.narudzbe);
      } else {
        const demo = generisiDemoNarudzbe(podaci.proizvodi);
        setNarudzbe(demo);
        void sacuvajNarudzbe(demo);
      }
      setSpremno(true);
    });
    return () => {
      otkazano = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (tajmer.current) clearTimeout(tajmer.current);
    };
  }, []);

  const postaviPoruku = useCallback((t: string) => {
    setPoruka(t);
    if (tajmer.current) clearTimeout(tajmer.current);
    tajmer.current = setTimeout(() => setPoruka(null), 2500);
  }, []);

  const dodajProizvod = useCallback(
    (p: Product) => {
      setProizvodi((prev) => {
        const sljedeci = [p, ...prev];
        void sacuvajProizvode(sljedeci);
        return sljedeci;
      });
      postaviPoruku("Proizvod dodan");
    },
    [postaviPoruku],
  );

  const izmijeniProizvod = useCallback(
    (slug: string, p: Product) => {
      setProizvodi((prev) => {
        const sljedeci = prev.map((x) => (x.slug === slug ? p : x));
        void sacuvajProizvode(sljedeci);
        return sljedeci;
      });
      postaviPoruku("Izmjene sačuvane");
    },
    [postaviPoruku],
  );

  const obrisiProizvod = useCallback(
    (slug: string) => {
      setProizvodi((prev) => {
        const sljedeci = prev.filter((x) => x.slug !== slug);
        void sacuvajProizvode(sljedeci);
        return sljedeci;
      });
      postaviPoruku("Proizvod obrisan");
    },
    [postaviPoruku],
  );

  const postaviStatus = useCallback(
    (id: string, status: StatusNarudzbe) => {
      setNarudzbe((prev) => {
        const sljedeci = prev.map((n) => (n.id === id ? { ...n, status } : n));
        void sacuvajNarudzbe(sljedeci);
        return sljedeci;
      });
      postaviPoruku("Status promijenjen");
    },
    [postaviPoruku],
  );

  const obrisiNarudzbu = useCallback(
    (id: string) => {
      setNarudzbe((prev) => {
        const sljedeci = prev.filter((n) => n.id !== id);
        void sacuvajNarudzbe(sljedeci);
        return sljedeci;
      });
      postaviPoruku("Narudžba obrisana");
    },
    [postaviPoruku],
  );

  const izmijeniPostavke = useCallback(
    (p: Postavke) => {
      setPostavke(p);
      void sacuvajPostavke(p);
      postaviPoruku("Postavke sačuvane");
    },
    [postaviPoruku],
  );

  const resetuj = useCallback(() => {
    void vratiNaPocetno().then(() => ucitajSve()).then((podaci) => {
      setProizvodi(podaci.proizvodi);
      setPostavke(podaci.postavke);
      const demo = generisiDemoNarudzbe(podaci.proizvodi);
      setNarudzbe(demo);
      void sacuvajNarudzbe(demo);
    });
    postaviPoruku("Vraćeno na početno stanje");
  }, [postaviPoruku]);

  const nadjiPoSlugu = useCallback(
    (slug: string) => proizvodi.find((p) => p.slug === slug),
    [proizvodi],
  );

  return (
    <Ctx.Provider
      value={{
        proizvodi,
        narudzbe,
        postavke,
        spremno,
        dodajProizvod,
        izmijeniProizvod,
        obrisiProizvod,
        nadjiPoSlugu,
        postaviStatus,
        obrisiNarudzbu,
        izmijeniPostavke,
        resetuj,
        poruka,
        postaviPoruku,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
