import type { StatusNarudzbe } from "@/lib/admin/tipovi";

const STIL: Record<StatusNarudzbe, string> = {
  nova: "bg-cobalt text-white",
  "u-obradi": "bg-ink text-white",
  poslana: "border border-steel text-steel",
  isporucena: "bg-[#127A3E] text-white",
  otkazana: "border border-line text-steel line-through",
};

const TEKST: Record<StatusNarudzbe, string> = {
  nova: "Nova",
  "u-obradi": "U obradi",
  poslana: "Poslana",
  isporucena: "Isporučena",
  otkazana: "Otkazana",
};

export default function StatusZnak({ status }: { status: StatusNarudzbe }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${STIL[status]}`}
    >
      {TEKST[status]}
    </span>
  );
}
