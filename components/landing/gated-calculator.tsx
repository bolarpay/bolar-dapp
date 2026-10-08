"use client";

import dynamic from "next/dynamic";
import { RemittanceCalculator } from "./remittance-calculator";
import { unavailableAuth } from "@/components/remittance/use-remittance-auth";

// Calculation is public; only continuing requires a verified Pollar session.
// The connected island waits for the browser provider before using its hooks.
export const GatedCalculator = dynamic(() => import("./gated-calculator-client"), {
  ssr: false,
  loading: () => <RemittanceCalculator auth={{ ...unavailableAuth, loading: true, error: "" }} />,
});
