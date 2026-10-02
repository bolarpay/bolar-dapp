"use client";

import { useRef, useState } from "react";
import { usePollar } from "@pollar/react";

const USDC_ISSUER = process.env.NEXT_PUBLIC_USDC_ISSUER ?? "";
const PAYMENT_DESTINATION = process.env.NEXT_PUBLIC_PAYMENT_DESTINATION ?? "";

export function PayButton() {
  const { runTx, isAuthenticated, verified, openTxModal } = usePollar();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const configured = Boolean(USDC_ISSUER && PAYMENT_DESTINATION);

  async function pay() {
    if (!isAuthenticated || !verified || !configured || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      openTxModal();
      const result = await runTx("payment", {
        destination: PAYMENT_DESTINATION,
        amount: "10",
        asset: { type: "credit_alphanum4", code: "USDC", issuer: USDC_ISSUER },
      });
      if (result.status === "error") setError("No se pudo completar el pago. Revisa el detalle de la transacción.");
    } catch {
      setError("No pudimos confirmar el resultado. Revisa el historial de tu wallet antes de volver a enviar.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="mt-4">
      {configured && <p className="mb-4 break-all text-xs leading-5 text-content-secondary">Destinatario: {PAYMENT_DESTINATION}</p>}
      <button type="button" disabled={!isAuthenticated || !verified || !configured || busy} onClick={pay} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? "Procesando pago…" : "Enviar 10 USDC"}
      </button>
      {!configured && <p className="mt-3 text-sm text-content-secondary">Este pago todavía no está habilitado.</p>}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
