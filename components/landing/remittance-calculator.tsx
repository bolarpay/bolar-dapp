"use client";

import dynamic from "next/dynamic";
import { BolarLoader, RemittanceTransition } from "@/components/remittance/bolar-loader";
import { RemittanceDialog } from "@/components/remittance/remittance-dialog";
import { useEffect, useState, type FormEvent } from "react";
import { convertAmount, parseAmount } from "@/lib/remittance-quote";
import { isFreshRate, loadReferenceRate, type ReferenceRate } from "@/lib/exchange-rate";
import { whatsappSupportUrl } from "@/lib/support";
import { unavailableAuth, type RemittanceAuth } from "@/components/remittance/use-remittance-auth";
import type { RemittanceStepsProps } from "@/components/remittance/remittance-steps";
import { Asset } from "./asset";

const RemittanceFlow = dynamic(() => import("@/components/remittance/remittance-flow"), {
  ssr: false,
  loading: () => <h2 id="remittance-title" role="status" className="py-16 text-center text-content-secondary">Preparando tu envío…</h2>,
});

function CurrencyField({ side, value, onChange, disabled }: { side: "send" | "receive"; value: string; onChange: (value: string) => void; disabled: boolean }) {
  const receiving = side === "receive";
  const code = receiving ? "BOB" : "BRL";
  const label = receiving ? "Recibe" : "Envías";
  return <div className="flex flex-col gap-2 px-4">
    <label htmlFor={`amount-${side}`} className="text-base font-medium leading-5">{label}</label>
    <div className={`flex h-12 items-center rounded-lg bg-field focus-within:ring-2 focus-within:ring-bolar-green ${receiving ? "ring-2 ring-inset ring-bolar-green" : ""}`}>
      <div className="relative flex h-12 shrink-0 items-center px-2 max-[380px]:px-1">
        <span className="pointer-events-none flex items-center gap-4 px-2 max-[380px]:gap-2 max-[380px]:px-1" aria-hidden="true">
          <span className="flex size-5 items-center justify-center"><Asset name={receiving ? "currency-bob" : "currency-brl"} width={receiving ? 18.3334 : 18.3333} height={receiving ? 13.3334 : 13.3333} /></span>
          <span className="text-base font-medium leading-5 max-[440px]:text-sm">{receiving ? "Bolivianos (BOB)" : "Reales (BRL)"}</span>
          <Asset name="chevron" width={20} height={20} />
        </span>
        <select aria-label={receiving ? "Moneda de destino" : "Moneda de origen"} defaultValue={code} className="absolute inset-0 cursor-pointer opacity-0"><option value={code}>{receiving ? "Bolivianos (BOB)" : "Reales (BRL)"}</option></select>
      </div>
      <input id={`amount-${side}`} name={side} aria-label={`${label} en ${code}`} aria-describedby="quote-rate" type="text" disabled={disabled} placeholder="—" inputMode="decimal" autoComplete="off" required pattern="[0-9]{1,9}([.,][0-9]{1,2})?" title="Ingresa un importe positivo con hasta dos decimales." value={value} onChange={(event) => onChange(event.target.value)} className="h-12 min-w-0 flex-1 rounded-lg bg-transparent pr-5 text-right text-2xl font-semibold leading-7 outline-none max-[440px]:pr-3 max-[440px]:text-xl" />
    </div>
  </div>;
}

function MethodField({ label, value, id, onChange, disabled }: { label: string; value: string; id: string; onChange: (value: string) => void; disabled: boolean }) {
  return <div className="flex min-h-8 items-center justify-between gap-3 px-4">
    <label htmlFor={id} className="text-sm leading-5">{label}</label>
    <div className="relative h-8 w-28 shrink-0 rounded-full bg-field">
      <select id={id} value={value} onChange={event => onChange(event.target.value)} disabled={disabled} className="h-full w-full cursor-pointer appearance-none rounded-full bg-transparent px-3 pr-7 text-sm font-medium">
        <option value={id === "payment-method" ? "pix" : "qr"}>{id === "payment-method" ? "Pix" : "QR"}</option>
        <option value="cash">Efectivo</option>
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2.5 size-3"><span className="block size-6 origin-top-left scale-50"><span className="block rotate-90"><Asset name="chevron-small" width={24} height={24} /></span></span></span>
    </div>
  </div>;
}

function CustomerSupport() {
  const url = whatsappSupportUrl(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER);
  const content = <><Asset name="whatsapp" width={20} height={20} /><span>WhatsApp</span></>;
  const style = "flex items-center justify-center gap-2 rounded-full border border-bolar-green px-3 py-2 text-sm font-semibold text-bolar-green transition-colors hover:border-bolar-dark hover:bg-bolar-dark hover:text-white";
  return <div className="mx-4 border-t border-field pt-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-medium">Atención al cliente</span>
      {url ? <a href={url} target="_blank" rel="noopener noreferrer" className={style} aria-label="Abrir atención al cliente de BOLAR en WhatsApp">{content}</a>
        : <button type="button" disabled aria-describedby="support-unavailable" className={`${style} cursor-not-allowed opacity-50`}>{content}</button>}
    </div>
    {!url && <p id="support-unavailable" className="mt-2 text-xs text-content-secondary">WhatsApp estará disponible pronto.</p>}
  </div>;
}

export function RemittanceCalculator({ auth = unavailableAuth }: { auth?: RemittanceAuth }) {
  const [input, setInput] = useState<{ side: "send" | "receive"; value: string }>({ side: "send", value: "500" });
  const [rate, setRate] = useState<ReferenceRate | null>(null);
  const [rateError, setRateError] = useState("");
  const [rateLoading, setRateLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cash">("pix");
  const [deliveryMethod, setDeliveryMethod] = useState<"qr" | "cash">("qr");
  const [error, setError] = useState("");
  const [requested, setRequested] = useState<Omit<RemittanceStepsProps, "onClose"> | null>(null);
  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const quote = await loadReferenceRate();
        if (active) { setRate(quote); setRateError(""); }
      } catch {
        if (active) { setRate(null); setRateError("No pudimos consultar el tipo de cambio. Inténtalo de nuevo."); }
      } finally { if (active) setRateLoading(false); }
    }
    void refresh();
    const interval = window.setInterval(refresh, 60 * 60 * 1000);
    const visible = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", visible);
    return () => { active = false; window.clearInterval(interval); document.removeEventListener("visibilitychange", visible); };
  }, [reload]);
  const converted = rate ? convertAmount(input.value, input.side, rate.rate) : "";
  const send = input.side === "send" ? input.value : converted;
  const receive = input.side === "receive" ? input.value : converted;
  const blocked = auth.busy || Boolean(requested && auth.signedIn);
  function update(value: string, side: "send" | "receive") { setError(""); setInput({ side, value }); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (blocked || auth.loading || !auth.available) return;
    if (!rate || !isFreshRate(rate)) {
      setError("Actualiza el tipo de cambio antes de continuar.");
      setRate(null); setRateLoading(true); setReload(value => value + 1); return;
    }
    if ((parseAmount(send) ?? 0) <= 0 || (parseAmount(receive) ?? 0) <= 0) {
      setError("Ingresa un importe mayor que cero y dentro del rango permitido."); return;
    }
    setError("");
    // Freeze amounts and methods while signing in; background rate refreshes must not alter this request.
    setRequested({ send, receive, paymentMethod, deliveryMethod });
    if (!auth.signedIn) {
      try { auth.signIn(); } catch { setError("No se pudo abrir el acceso con Google. Inténtalo de nuevo."); setRequested(null); }
    }
  }
  return <>
    <form id="calcular-envio" aria-label="Calculadora de envío de dinero" aria-describedby={error ? "quote-error" : "quote-rate"} onSubmit={submit} className="relative flex w-[423px] max-w-full scroll-mt-8 flex-col gap-4 rounded-[14px] border border-card-border bg-white p-[23px] shadow-quote max-[440px]:p-[15px]" data-node-id="260:14189">
      <CurrencyField side="send" value={send} disabled={blocked} onChange={(value) => update(value, "send")} />
      <CurrencyField side="receive" value={receive} disabled={blocked} onChange={(value) => update(value, "receive")} />
      <div id="quote-rate" className="px-4 text-right text-xs leading-5 text-content-secondary" aria-live="polite">
        {rate ? <>
          <p className="font-medium text-bolar-green">1 BRL = {rate.rate.toLocaleString("es-BO", { maximumFractionDigits: 4 })} BOB</p>
          <p>Referencia actualizada: {new Date(rate.updatedAt).toLocaleDateString("es-BO", { timeZone: "America/La_Paz", day: "2-digit", month: "2-digit", year: "numeric" })}</p>
        </> : <p>{rateLoading ? "Consultando tipo de cambio…" : rateError}</p>}
        <p>Tipo de cambio de referencia, sin comisiones. El monto final puede variar.</p>
        <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="underline underline-offset-2">Rates By Exchange Rate API</a>
        {rateError && <button type="button" disabled={rateLoading} onClick={() => { setRateLoading(true); setReload(value => value + 1); }} className="ml-3 font-medium text-bolar-green underline disabled:opacity-50">Reintentar</button>}
      </div>
      <MethodField label="Método de pago" value={paymentMethod} id="payment-method" disabled={blocked} onChange={value => setPaymentMethod(value as "pix" | "cash")} />
      <MethodField label="Método de entrega" value={deliveryMethod} id="delivery-method" disabled={blocked} onChange={value => setDeliveryMethod(value as "qr" | "cash")} />
      {(paymentMethod === "cash" || deliveryMethod === "cash") && <p className="px-4 text-xs leading-5 text-content-secondary">La opción de efectivo está en preparación. Este recorrido no registra cobros ni reservas de retiro.</p>}
      <button type="submit" disabled={!rate || blocked || auth.loading || !auth.available} className="primary-button mx-4 min-h-14 disabled:cursor-not-allowed disabled:opacity-50">
        {auth.busy ? <BolarLoader compact label="Verificando tu sesión" /> : auth.loading ? "Preparando acceso…" : auth.signedIn ? "Continuar" : "Continuar con Gmail"}
      </button>
      {!auth.signedIn && <p className="px-4 text-center text-xs text-content-secondary">Inicia sesión con tu cuenta de Google para continuar.</p>}
      {auth.busy && <button type="button" onClick={() => { auth.cancel(); setRequested(null); }} className="text-sm text-bolar-green underline">Cancelar inicio de sesión</button>}
      {auth.error && <p role="alert" className="px-4 text-sm text-red-700">{auth.error}</p>}
      {auth.retry && <button type="button" onClick={auth.retry} className="text-sm text-bolar-green underline">Reintentar acceso</button>}
      {error && <p id="quote-error" role="alert" className="px-4 text-sm text-red-700">{error}</p>}
      <CustomerSupport />
    </form>
    {requested && auth.signedIn && <RemittanceDialog onClose={() => setRequested(null)}>
      <RemittanceTransition>
        <RemittanceFlow {...requested} onClose={() => setRequested(null)} />
      </RemittanceTransition>
    </RemittanceDialog>}
  </>;
}
