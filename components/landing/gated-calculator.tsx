"use client";

import dynamic from "next/dynamic";
import { HeroImage } from "./hero-image";

// Muestra la calculadora solo con sesión. usePollar() necesita el provider del
// navegador, así que la isla no se renderiza en el servidor; mientras carga se
// ve la misma imagen que verá quien no ha iniciado sesión.
export const GatedCalculator = dynamic(() => import("./gated-calculator-client"), {
  ssr: false,
  loading: () => <HeroImage />,
});
