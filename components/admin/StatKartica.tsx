export default function StatKartica({
  oznaka,
  vrijednost,
  napomena,
}: {
  oznaka: string;
  vrijednost: string;
  napomena?: string;
}) {
  return (
    <div className="border border-line bg-white p-5">
      <p className="label-tech">{oznaka}</p>
      <p className="h-display mt-2 text-[clamp(1.375rem,3vw,1.875rem)] leading-none tabular-nums">
        {vrijednost}
      </p>
      {napomena && <p className="mt-2 text-xs text-steel">{napomena}</p>}
    </div>
  );
}
