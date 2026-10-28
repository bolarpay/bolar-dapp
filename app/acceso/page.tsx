import type { Metadata } from "next";
import Link from "next/link";
import { Asset } from "@/components/landing/asset";
import { AccessClient } from "./access-client";

export const metadata: Metadata = {
  title: "Accede a tu cuenta | Bolar",
  description: "Inicia sesión en Bolar y accede a tu wallet.",
};

export default function AccessPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-field bg-white px-6 py-5 sm:px-10">
        <Link href="/" aria-label="Bolar, inicio"><Asset name="bolar-logo" width={174} height={48} alt="Bolar" /></Link>
        <Link href="/" className="text-sm font-medium text-bolar-green hover:underline">← Volver al inicio</Link>
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <section className="relative overflow-hidden rounded-3xl bg-bolar-green p-8 text-white sm:p-12" aria-labelledby="access-intro">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/75">REMESAS INTERNACIONALES</p>
          <h2 id="access-intro" className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">Tu dinero,<br />más cerca.</h2>
          <p className="mt-6 max-w-sm text-lg leading-7 text-white/80">El primer paso para conectar con los tuyos empieza aquí.</p>
          <div className="mt-10 flex items-center gap-5" aria-hidden="true">
            <Asset name="brazil" width={56} height={56} />
            <span className="h-px flex-1 bg-white/30" /><span className="text-2xl">→</span><span className="h-px flex-1 bg-white/30" />
            <Asset name="bolivia" width={56} height={56} />
          </div>
          <p className="mt-6 text-sm text-white/75">Brasil y Bolivia, un poco más cerca.</p>
        </section>
        <section className="min-w-0 rounded-3xl border border-card-border bg-white p-6 shadow-quote sm:p-10" aria-label="Acceso a Bolar">
          <AccessClient />
        </section>
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-6 px-6 pb-8 text-sm text-content-secondary sm:gap-10">
        <span className="flex items-center gap-3">Powered by <Asset name="stellar-logo" width={112} height={28} alt="Stellar" /></span>
        <span className="flex items-center gap-3">Protected by <Asset name="pollar-logo" width={130} height={28} alt="Pollar" /></span>
      </footer>
    </div>
  );
}
