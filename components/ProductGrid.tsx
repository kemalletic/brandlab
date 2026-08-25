import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

export default function ProductGrid({
  proizvodi,
  prioritetPrvih = 0,
}: {
  proizvodi: Product[];
  prioritetPrvih?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {proizvodi.map((p, i) => (
        <ProductCard
          key={p.slug}
          proizvod={p}
          priority={i < prioritetPrvih}
        />
      ))}
    </div>
  );
}
