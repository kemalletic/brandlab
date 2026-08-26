import type { Metadata } from "next";
import PrijavaClient from "./PrijavaClient";

export const metadata: Metadata = {
  title: "Prijava",
  description: "Prijavi se na svoj BRANDLAB račun.",
};

export default function PrijavaPage() {
  return <PrijavaClient />;
}
