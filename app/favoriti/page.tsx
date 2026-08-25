import type { Metadata } from "next";
import FavoritiClient from "./FavoritiClient";

export const metadata: Metadata = {
  title: "Favoriti",
  description: "Proizvodi koje si sačuvao za kasnije.",
};

export default function FavoritiPage() {
  return <FavoritiClient />;
}
