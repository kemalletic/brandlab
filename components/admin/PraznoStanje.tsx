import type { ReactNode } from "react";

export default function PraznoStanje({
  ikona,
  naslov,
  opis,
  akcija,
}: {
  ikona: ReactNode;
  naslov: string;
  opis: string;
  akcija?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center border border-line bg-white px-6 py-16 text-center">
      <div className="mb-4 text-line">{ikona}</div>
      <p className="h-display-narrow mb-2 text-xl">{naslov}</p>
      <p className="mb-6 max-w-sm text-sm text-steel">{opis}</p>
      {akcija}
    </div>
  );
}
