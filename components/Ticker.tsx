const PORUKE = [
  "BESPLATNA DOSTAVA IZNAD 100 KM",
  "NOVI DROP UPRAVO STIGAO",
  "BRZA DOSTAVA ZA 48H",
  "BRANDLAB — GRAD JE TVOJ TEREN",
];

export default function Ticker() {
  const items = [...PORUKE, ...PORUKE];
  return (
    <div className="marquee bg-cobalt py-2.5">
      <div className="marquee-track">
        {items.map((msg, i) => (
          <span
            key={i}
            className="flex items-center px-6 text-xs font-bold uppercase tracking-[0.14em] text-white"
          >
            {msg}
            <span className="ml-6 text-white/40">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
