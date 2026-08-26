import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Cijela BRANDLAB kolekcija — duksevi, majice, jakne, pantalone, patike i dodaci.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ShopClient />
    </Suspense>
  );
}
