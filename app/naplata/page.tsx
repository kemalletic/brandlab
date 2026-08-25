import type { Metadata } from "next";
import NaplataClient from "./NaplataClient";

export const metadata: Metadata = {
  title: "Naplata",
  description: "Dovrši narudžbu — podaci, dostava i plaćanje.",
};

export default function NaplataPage() {
  return <NaplataClient />;
}
