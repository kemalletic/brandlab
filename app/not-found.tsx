import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <p className="h-display text-[clamp(5rem,22vw,14rem)] leading-[0.85] text-cobalt">
        404
      </p>
      <h1 className="h-display-narrow mt-4 text-2xl">
        Stranica nije pronađena
      </h1>
      <p className="mt-4 max-w-sm text-sm text-steel">
        Link je možda istekao ili je proizvod rasprodan i povučen iz kolekcije.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Na početnu
        </Link>
        <Link href="/shop" className="btn btn-ghost-dark">
          U shop
        </Link>
      </div>
    </div>
  );
}
