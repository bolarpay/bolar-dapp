"use client";

import { RemittanceCalculator } from "./remittance-calculator";
import { useRemittanceAuth } from "@/components/remittance/use-remittance-auth";

function ConnectedCalculator() {
  const auth = useRemittanceAuth();
  return <RemittanceCalculator auth={auth} />;
}

export default function GatedCalculatorClient() {
  if (!process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY) return <RemittanceCalculator />;
  return <ConnectedCalculator />;
}
