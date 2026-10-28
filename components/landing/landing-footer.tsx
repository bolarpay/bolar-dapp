import Link from "next/link";
import { whatsappSupportUrl } from "@/lib/support";
import { Asset } from "./asset";

const linkClass = "text-sm leading-6 underline-offset-4 transition-colors hover:text-bolar-dark hover:underline";

export function LandingFooter() {
  const supportUrl = whatsappSupportUrl(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER);
  return (
    <footer id="contacto" className="mx-auto mb-[42px] mt-auto w-[calc(100%-32px)] max-w-[1220px] scroll-mt-8 rounded-3xl bg-footer-green px-6 py-10 font-footer text-footer-ink md:px-[55px]" data-node-id="260:14281">
      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-5">
          <a href="#inicio" aria-label="BOLAR, volver al inicio" className="rounded-lg bg-white px-2"><Asset name="bolar-logo" width={203} height={56} alt="BOLAR" /></a>
          <p className="max-w-sm text-sm leading-6">Remesas internacionales.<br />Brasil y Bolivia, un poco más cerca.</p>
        </div>
        <nav aria-label="Enlaces de BOLAR" className="flex flex-col items-start gap-4">
          <h2 className="text-lg font-bold">BOLAR</h2>
          <a href="#calcular-envio" className={linkClass}>Calcular envío</a>
          <Link href="/acceso" className={linkClass}>Acceder a mi cuenta</Link>
          <a href="https://github.com/bolarpay/bolar-dapp" target="_blank" rel="noopener noreferrer" className={linkClass}>Desarrolladores</a>
        </nav>
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-lg font-bold">Atención al cliente</h2>
          {supportUrl ? <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="secondary-button flex items-center gap-2"><Asset name="whatsapp" width={20} height={20} />WhatsApp</a>
            : <p className="text-sm leading-6">Nuestro canal de WhatsApp estará disponible pronto.</p>}
        </div>
      </div>
      <p className="mt-10 border-t border-bolar-dark/20 pt-6 text-center text-sm leading-6">© {new Date().getFullYear()} BOLAR. Todos los derechos reservados.</p>
    </footer>
  );
}
