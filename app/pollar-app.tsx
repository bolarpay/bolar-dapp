"use client";

import { WalletButton, usePollar } from "@pollar/react";
import { LoginButton } from "./login-button";
import { PayButton } from "./pay-button";

function AccountAccess() {
  const { isAuthenticated, verified, configStatus, retryConfig, network } = usePollar();
  const signedIn = isAuthenticated && verified;

  return (
    <>
      <p className="text-sm font-semibold text-bolar-green">{signedIn ? "MI BOLAR" : "BIENVENIDO A BOLAR"}</p>
      <h1 className="mt-3 text-3xl font-bold leading-tight">{signedIn ? "Tu cuenta, en un solo lugar." : "Conecta con lo que importa."}</h1>
      <p className="mt-4 text-base leading-7 text-content-secondary">
        {signedIn ? "Consulta tu wallet y gestiona tu sesión." : "Inicia sesión o crea tu cuenta con las opciones disponibles en nuestro acceso con Pollar."}
      </p>
      <div className="mt-8">
        {configStatus === "error" && !signedIn ? (
          <div role="alert" className="rounded-xl bg-field p-5">
            <p className="text-sm leading-6">No pudimos cargar las opciones de acceso. Revisa tu conexión e inténtalo de nuevo.</p>
            <button type="button" className="primary-button mt-4 w-full" onClick={retryConfig}>Reintentar</button>
          </div>
        ) : <LoginButton />}
      </div>
      {signedIn && (
        <div className="mt-8 border-t border-field pt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Tu wallet</h2>
            <span className="rounded-full bg-field px-3 py-1 text-xs font-medium">{network === "testnet" ? "Red de pruebas · Testnet" : "Red principal · Mainnet"}</span>
          </div>
          <WalletButton />
          <details className="mt-6 rounded-xl border border-field p-4">
            <summary className="text-sm font-medium">Pago de desarrollo · 10 USDC</summary>
            <p className="mt-3 text-sm leading-6 text-content-secondary">Este pago usa la red y el destinatario configurados para el MVP. Es independiente del simulador de remesas.</p>
            <PayButton />
          </details>
        </div>
      )}
      {!signedIn && <p className="mt-6 text-sm leading-6 text-content-secondary">Al iniciar sesión podrás acceder a tu wallet. El simulador de la portada sigue disponible sin una cuenta.</p>}
    </>
  );
}

export default function PollarApp() {
  const apiKey = process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY;
  if (!apiKey) {
    return <div role="status"><h1 className="text-2xl font-bold">El acceso estará disponible pronto</h1><p className="mt-4 leading-7 text-content-secondary">Estamos preparando el inicio de sesión. Mientras tanto, puedes explorar el simulador desde la portada.</p></div>;
  }
  return <AccountAccess />;
}
