import type { Metadata } from "next";
import RegistracijaClient from "./RegistracijaClient";

export const metadata: Metadata = {
  title: "Registracija",
  description: "Otvori BRANDLAB račun — brža naplata i sačuvani favoriti.",
};

export default function RegistracijaPage() {
  return <RegistracijaClient />;
}
