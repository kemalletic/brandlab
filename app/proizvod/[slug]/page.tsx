import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROIZVODI, nadjiProizvod } from "@/lib/products";
import ProductView from "./ProductView";

export function generateStaticParams() {
  return PROIZVODI.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/proizvod/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const proizvod = nadjiProizvod(slug);
  if (!proizvod) return { title: "Proizvod nije pronađen" };
  return {
    title: proizvod.naziv,
    description: proizvod.opis,
  };
}

export default async function ProizvodPage({
  params,
}: PageProps<"/proizvod/[slug]">) {
  const { slug } = await params;
  const proizvod = nadjiProizvod(slug);
  if (!proizvod) notFound();
  return <ProductView proizvod={proizvod} />;
}
