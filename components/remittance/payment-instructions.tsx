import Image from "next/image";
import { QrImage } from "./qr-image";
import { Spinner } from "./spinner";
import "./bolar-field.css";

type PaymentInstructionsProps = {
  send: string;
  paymentMethod: "pix" | "cash";
  transactionStatus: string;
  qrAvailable: boolean;
  qrPix: string;
  qrDetail: string;
  onAcceptTerms: () => void;
  onContinueAtBridge: () => void;
  onSend: () => void;
};

export function PaymentInstructions({ send, paymentMethod, transactionStatus, qrAvailable, qrPix, qrDetail, onAcceptTerms, onContinueAtBridge, onSend }: PaymentInstructionsProps) {
  const hasBridgeQr = qrAvailable && Boolean(qrPix);

  return <div className="mt-8 flex flex-col items-center text-center">
    <h3 className="max-w-[480px] text-xl font-semibold leading-7">
      {paymentMethod === "pix" ? `Envía ${hasBridgeQr ? send : "50"} Reales (BRL) con QR PIX` : "Envía dinero en efectivo"}
    </h3>
    {paymentMethod === "pix" ? <>
      <div className="bolar-ramp-payment-field mt-5">
        <span className="bolar-ramp-payment-label">Estado</span>
        <div className="bolar-ramp-payment-value">
          <code>{transactionStatus || "Pendiente"}</code>
          <Spinner />
        </div>
      </div>
      <div className="mt-6 flex w-full min-w-0 flex-col items-center">
        {hasBridgeQr ? <>
          <QrImage name="pix" svg={qrPix} width={240} height={240} alt="QR PIX de la operación en Bridge" />
          <p className="mt-3 max-w-full break-all text-sm leading-5">{qrDetail}</p>
        </> : <>
          <Image src="/assets/landing/pix-payment-50-brl.jpeg" width={586} height={584} loading="eager" unoptimized alt="QR PIX proporcionado por el equipo BOLAR para 50 BRL" className="h-auto w-60 max-w-full" />
          <p className="mt-3 text-xs text-content-secondary">QR fijo proporcionado por el equipo para 50 BRL; no corresponde a una nueva operación de Bridge.</p>
        </>}
      </div>
      <div className="mt-6 flex w-full max-w-[344px] flex-col gap-3">
        <button type="button" onClick={onAcceptTerms} className="secondary-button w-full">Aceptar los términos en Bridge</button>
        <button type="button" onClick={onContinueAtBridge} className="secondary-button w-full">Continúa en Bridge</button>
      </div>
    </> : <p className="mt-6 rounded-xl bg-field p-5 text-sm leading-6">Pago en efectivo seleccionado. Los puntos de cobro todavía no están disponibles; esta demostración no acepta dinero.</p>}
    <button type="button" onClick={onSend} className="primary-button mt-6 w-full max-w-[344px]">Enviar dinero</button>
    <p className="mt-3 max-w-[344px] text-xs leading-5 text-content-secondary">Este botón muestra el resumen de la demostración; no confirma ni ejecuta el pago.</p>
  </div>;
}
