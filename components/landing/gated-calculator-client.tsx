"use client";

import { usePollar } from "@pollar/react";
import { HeroImage } from "./hero-image";
import { RemittanceCalculator } from "./remittance-calculator";

export default function GatedCalculatorClient() {
  const { isAuthenticated, verified } = usePollar();
  if (isAuthenticated && verified) return <RemittanceCalculator />;
  return <HeroImage />;
}
