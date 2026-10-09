"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Asset } from "@/components/landing/asset";
import "./bolar-loader.css";

/** Artwork and animation adapted from the team's BOLAR-loader.html. */
export function BolarLoader({ label, hint, compact = false }: { label: string; hint?: string; compact?: boolean }) {
  const plane = <span className="bolar-loader__plane"><Asset name="bolar-symbol" width={compact ? 36 : 72} height={compact ? 36 : 72} /></span>;
  const track = <span className="bolar-loader__track"><span className="bolar-loader__motion" /></span>;
  return <span className={`bolar-loader ${compact ? "bolar-loader--compact" : "mx-auto block"}`} role="status" aria-label={label}>
    {compact ? <>
      <span aria-hidden="true">{plane}</span>
      <span className="bolar-loader__copy" aria-hidden="true">{label}<span className="bolar-loader__ellipsis" /></span>
    </> : <>
      <span className="bolar-loader__brand block" aria-hidden="true"><Asset name="bolar-logo" width={166} height={46} /></span>
      <span className="bolar-loader__journey block" aria-hidden="true">{plane}{track}<span className="bolar-loader__end" /></span>
      <span className="bolar-loader__title block" aria-hidden="true">{label}<span className="bolar-loader__ellipsis" /></span>
      {hint && <span className="bolar-loader__hint block">{hint}</span>}
    </>}
  </span>;
}

/** Mount only after authentication; the delay never substitutes session verification. */
export function RemittanceTransition({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 800);
    return () => window.clearTimeout(timer);
  }, []);
  if (ready) return children;
  return <div className="py-10" aria-busy="true">
    <h2 id="remittance-title" className="sr-only">Preparando el formulario</h2>
    <BolarLoader label="Preparando tus datos" hint="Enseguida podrás completar los datos del destinatario." />
  </div>;
}
