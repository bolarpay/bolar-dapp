"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Asset } from "@/components/landing/asset";

import type { RemittanceAuth } from "./use-remittance-auth";

export type RemittanceStepsProps = {
  send: string; receive: string; onClose: () => void;
  paymentMethod?: "pix" | "cash"; deliveryMethod?: "qr" | "cash";
};

function Stepper({ step, onAmount, onRecipient }: { step: number; onAmount: () => void; onRecipient: () => void }) {
  return <ol className="remittance-stepper" aria-label="Progreso del envío">
    {["Monto", "Motivo de envío", "Cargar y finalizar"].map((label, index) => {
      const number = index + 1;
      const content = <><span className={`remittance-step-dot ${number <= step ? "is-active" : ""}`} aria-hidden="true">{number < step ? "✓" : number}</span><span>{label}</span></>;
      return <li key={label} aria-current={number === step ? "step" : undefined} className={number < step ? "is-complete" : ""}>
        {number < step ? <button type="button" onClick={number === 1 ? onAmount : onRecipient} className="remittance-step-label">{content}</button> : <span className="remittance-step-label">{content}</span>}
      </li>;
    })}
  </ol>;
}

export function RemittanceSteps({ send, receive, onClose, auth, paymentMethod = "pix", deliveryMethod = "qr" }: RemittanceStepsProps & { auth: RemittanceAuth }) {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [continueRequested, setContinueRequested] = useState(false);
  const [finished, setFinished] = useState(false);
  const upload = useRef<HTMLInputElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const selection = useRef(0);
  const showQrUpload = deliveryMethod === "qr";
  const recipientComplete = Boolean(name.trim() && reason);
  const step = continueRequested && auth.signedIn && recipientComplete ? 3 : 2;
  const showSummary = step === 3 && finished;

  useEffect(() => () => { selection.current += 1; }, []);

  useEffect(() => { title.current?.focus(); }, [step, showSummary]);

  // Revoke previews when replaced or the flow closes; nothing is uploaded.
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function selectQr(event: ChangeEvent<HTMLInputElement>) {
    const candidate = event.target.files?.[0];
    event.target.value = "";
    if (!candidate) return;
    const currentSelection = ++selection.current;
    setError("");
    setFile(null);
    setPreview("");
    if (!["image/png", "image/jpeg", "image/webp"].includes(candidate.type) || candidate.size > 5 * 1024 * 1024) {
      setError("Selecciona una imagen PNG, JPG o WebP de hasta 5 MB.");
      return;
    }
    try {
      const bitmap = await createImageBitmap(candidate);
      bitmap.close();
      if (currentSelection !== selection.current) return;
      setFile(candidate);
      setPreview(URL.createObjectURL(candidate));
    } catch {
      if (currentSelection === selection.current) setError("No pudimos abrir esta imagen. Prueba con otro archivo.");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recipientComplete) {
      setError("Completa el nombre y el motivo para continuar.");
      return;
    }
    if (auth.busy || auth.loading || !auth.available) return;
    setError("");
    setContinueRequested(true);
    if (!auth.signedIn) {
      try { auth.signIn(); }
      catch { setError("No se pudo abrir el acceso. Inténtalo de nuevo."); setContinueRequested(false); }
    }
  }

  function back() { setContinueRequested(false); setFinished(false); setError(""); }

  return <>
    <h2 id="remittance-title" ref={title} tabIndex={-1} className="mb-6 text-center text-xl font-semibold">{showSummary ? "Resumen de la demostración" : step === 2 ? "Motivo de envío" : "Cargar y finalizar"}</h2>
    <Stepper step={step} onAmount={onClose} onRecipient={back} />
    {step === 2 ? <form onSubmit={submit} className="mt-12" aria-describedby={error ? "recipient-error" : undefined}>
      {showQrUpload && <div className="mx-auto flex min-h-36 w-full max-w-[372px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-content-tertiary bg-background p-4">
        <label htmlFor="recipient-qr" className="text-sm text-content-secondary">QR del destinatario (opcional)</label>
        <p id="recipient-qr-help" className="text-center text-xs text-content-secondary">Puedes continuar sin cargar una imagen.</p>
        {preview && <>
          {/* The preview is an in-memory blob, not a remote or optimized image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Imagen seleccionada del QR del destinatario" width={96} height={96} className="size-24 object-contain" />
        </>}
        <input ref={upload} id="recipient-qr" type="file" aria-describedby="recipient-qr-help" accept="image/png,image/jpeg,image/webp" onChange={selectQr} disabled={auth.busy} className="sr-only" tabIndex={-1} />
        <button type="button" disabled={auth.busy} onClick={() => upload.current?.click()} className="rounded-full bg-field px-4 py-2 text-sm font-medium disabled:opacity-50">{file ? "Cambiar imagen" : "Cargar"}</button>
        {file && <span className="max-w-full truncate text-xs text-content-secondary">{file.name}</span>}
      </div>}
      {!showQrUpload && <p className="rounded-lg bg-field p-4 text-sm leading-6">Entrega en efectivo: completa el nombre del destinatario y el motivo. La disponibilidad de puntos de retiro está pendiente.</p>}
      <div className="mt-10 flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-base font-medium" htmlFor="recipient-name">Nombre completo
          <input id="recipient-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Carlos Torres Ramírez" required disabled={auth.busy} maxLength={120} autoComplete="off" className="remittance-field" />
        </label>
        <label className="flex flex-col gap-2 text-base font-medium" htmlFor="transfer-reason">Motivo
          <select id="transfer-reason" value={reason} onChange={(event) => setReason(event.target.value)} required disabled={auth.busy} className="remittance-field">
            <option value="" disabled>Selecciona el motivo</option>
            <option>Ayuda familiar</option><option>Gastos personales</option><option>Pago de servicios</option><option>Otro</option>
          </select>
        </label>
      </div>
      {error && <p id="recipient-error" role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {auth.error && <p role="alert" className="mt-4 text-sm text-red-700">{auth.error}</p>}
      {auth.retry && <button type="button" onClick={auth.retry} className="mt-3 text-sm text-bolar-green underline">Reintentar conexión</button>}
      <button type="submit" disabled={auth.busy || auth.loading || !auth.available} className="primary-button mx-auto mt-10 block w-full max-w-[344px] disabled:cursor-not-allowed disabled:opacity-50">
        {auth.busy ? "Verificando tu sesión…" : auth.loading ? "Preparando acceso…" : "Continuar"}
      </button>
      {auth.busy ? <button type="button" onClick={() => { auth.cancel(); setContinueRequested(false); }} className="mx-auto mt-3 block text-sm text-bolar-green underline">Cancelar inicio de sesión</button>
        : !auth.signedIn && <p className="mt-3 text-center text-xs text-content-secondary">Al continuar, inicia sesión con Google para seguir.</p>}
      <p className="mt-4 text-center text-xs leading-5 text-content-secondary">{showQrUpload ? "Demostración. Si adjuntas una imagen, queda en tu navegador; aún no validamos los datos del QR." : "Demostración. No se ha reservado una entrega en efectivo."}</p>
    </form> : showSummary ? <div className="mt-10">
      <h3 className="text-center text-2xl font-semibold">Demostración finalizada</h3>
      <dl className="my-6 grid grid-cols-[1fr_1fr] gap-3 rounded-xl bg-field p-5 text-sm">
        <dt>Destinatario</dt><dd className="break-words text-right font-medium">{name.trim()}</dd>
        <dt>Motivo</dt><dd className="text-right">{reason}</dd>
        <dt>Método de pago</dt><dd className="text-right">{paymentMethod === "cash" ? "Efectivo" : "Pix"}</dd>
        <dt>Método de entrega</dt><dd className="text-right">{deliveryMethod === "cash" ? "Efectivo" : "QR"}</dd>
        <dt>Envías</dt><dd className="text-right">{send} BRL</dd>
        <dt>Recibe</dt><dd className="text-right">{receive} BOB</dd>
      </dl>
      <p role="status" className="text-center leading-6 text-content-secondary">No se ha enviado dinero ni se ha verificado un depósito. Este recorrido muestra cómo funcionará el envío.</p>
      <button type="button" onClick={onClose} className="primary-button mx-auto mt-8 block w-full max-w-[344px]">Volver al inicio</button>
    </div> : <div className="mt-12 flex flex-col items-center text-center">
      {paymentMethod === "pix" ? <>
        <Asset name="demo-payment-qr" width={184} height={184} alt="QR de demostración. No sirve para realizar pagos." />
        <p className="mt-3 text-sm font-semibold leading-5">BOLAR · DEMOSTRACIÓN<br />SIN CLAVE PIX DE PAGO</p>
      </> : <p className="rounded-xl bg-field p-5 text-sm leading-6">Pago en efectivo seleccionado. Los puntos de cobro todavía no están disponibles; esta demostración no acepta dinero.</p>}
      <p className="mt-10 max-w-[480px] text-xl leading-6 text-content-secondary">Envía dinero a otro país y haz que tu familiar o amigo lo reciba en minutos.</p>
      <button type="button" onClick={() => setFinished(true)} className="primary-button mt-12 w-full max-w-[344px]">Verificar y finalizar</button>
      <p className="mt-4 text-xs leading-5 text-content-secondary">{paymentMethod === "pix" ? "QR de ejemplo, sin valor de pago. La verificación de depósitos estará disponible al integrar el proveedor." : "No se ha registrado ningún pago en efectivo."}</p>
    </div>}
  </>;
}
