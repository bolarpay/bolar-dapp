"use client";

import { usePollar } from "@pollar/react";

export function LoginButton() {
  const { isAuthenticated, verified, configStatus, logout, wallet, getClient, openLoginModal } = usePollar();
  if (isAuthenticated && verified) {
    const profile = getClient().getUserProfile();
    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
    return (
      <div className="rounded-2xl bg-field p-5">
        <div className="flex items-center gap-3">
          {profile?.avatar && (
            // Avatar hosts depend on the authentication provider.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt="Avatar del usuario" width={48} height={48} referrerPolicy="no-referrer" className="size-12 rounded-full object-cover" />
          )}
          <div className="min-w-0">
            <p className="font-semibold">{name || "Tu sesión está activa"}</p>
            {profile?.mail && <p className="break-all text-sm text-content-secondary">{profile.mail}</p>}
          </div>
        </div>
        {wallet?.address && <p className="mt-4 break-all font-mono text-xs leading-5 text-content-secondary">{wallet.address}</p>}
        <button type="button" onClick={() => logout()} className="mt-5 text-sm font-semibold text-bolar-green underline underline-offset-4">Cerrar sesión</button>
      </div>
    );
  }
  if (isAuthenticated && !verified) {
    return <div><p role="status" className="text-sm text-content-secondary">Verificando tu sesión…</p><button type="button" className="mt-4 text-sm text-bolar-green underline" onClick={() => logout()}>Volver a iniciar sesión</button></div>;
  }
  return (
    <button type="button" disabled={configStatus !== "ready"} className="primary-button w-full disabled:cursor-wait disabled:opacity-60" onClick={openLoginModal}>
      {configStatus === "loading" ? "Preparando tu acceso…" : "Iniciar sesión"}
    </button>
  );
}
