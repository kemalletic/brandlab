"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAdmin } from "@/lib/admin/store";
import {
  IconBox,
  IconExternal,
  IconGear,
  IconGrid,
  IconReceipt,
} from "@/components/Icons";

const NAV = [
  { href: "/admin", label: "Ploča", Ikona: IconGrid },
  { href: "/admin/proizvodi", label: "Proizvodi", Ikona: IconBox },
  { href: "/admin/narudzbe", label: "Narudžbe", Ikona: IconReceipt },
  { href: "/admin/postavke", label: "Postavke", Ikona: IconGear },
];

function jeAktivna(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { poruka, narudzbe, spremno } = useAdmin();

  const novih = spremno
    ? narudzbe.filter((n) => n.status === "nova").length
    : 0;

  return (
    <div className="flex min-h-screen bg-smoke">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-[232px] flex-col bg-ink text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-5">
          <Link href="/admin" className="h-display block text-lg leading-none">
            BRANDLAB
          </Link>
          <span className="label-tech mt-1 block text-cobalt">Admin</span>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map(({ href, label, Ikona }) => {
            const aktivna = jeAktivna(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 border-l-2 px-6 py-3 text-sm font-medium transition-colors ${
                  aktivna
                    ? "border-cobalt bg-white/[0.06] text-white"
                    : "border-transparent text-white/60 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <Ikona className="h-[18px] w-[18px]" />
                {label}
                {href === "/admin/narudzbe" && novih > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-cobalt px-1.5 text-[10px] font-bold leading-none">
                    {novih}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/60 hover:text-white"
          >
            <IconExternal className="h-4 w-4" />
            Nazad na sajt
          </Link>
        </div>
      </aside>

      {/* Sadržaj */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-[232px]">
        <div className="flex items-center justify-between gap-3 bg-ink px-4 py-3 text-white lg:hidden">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="h-display text-base leading-none">BRANDLAB</span>
            <span className="label-tech text-cobalt">Admin</span>
          </Link>
          <Link
            href="/"
            className="-mr-1.5 flex h-9 items-center gap-1.5 px-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70"
          >
            <IconExternal className="h-4 w-4" />
            Na sajt
          </Link>
        </div>

        <div className="border-b border-line bg-white px-4 py-2.5 sm:px-8">
          <p className="text-[11px] leading-relaxed text-steel">
            <span className="font-semibold text-ink">Demo.</span> Izmjene se
            čuvaju u ovom browseru i ne mijenjaju javni sajt.
          </p>
        </div>

        <main className="min-w-0 flex-1 px-5 py-8 pb-24 sm:px-8 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Navigacija — mobitel */}
      <nav className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-4 border-t border-line bg-white lg:hidden">
        {NAV.map(({ href, label, Ikona }) => {
          const aktivna = jeAktivna(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${
                aktivna ? "text-cobalt" : "text-steel"
              }`}
            >
              <Ikona className="h-5 w-5" />
              {label}
              {href === "/admin/narudzbe" && novih > 0 && (
                <span className="absolute right-[22%] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cobalt px-1 text-[9px] font-bold leading-none text-white">
                  {novih}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {poruka && (
        <div
          role="status"
          className="toast-in fixed bottom-20 left-1/2 z-[100] -translate-x-1/2 border-l-2 border-cobalt bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0"
        >
          {poruka}
        </div>
      )}
    </div>
  );
}
