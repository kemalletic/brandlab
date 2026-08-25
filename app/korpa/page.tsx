import type { Metadata } from "next";
import KorpaClient from "./KorpaClient";

export const metadata: Metadata = {
  title: "Korpa",
  description: "Pregled proizvoda u tvojoj BRANDLAB korpi.",
};

export default function KorpaPage() {
  return <KorpaClient />;
}
