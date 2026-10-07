"use client";

import { useCallback, useSyncExternalStore } from "react";
import { usePollar } from "@pollar/react";

export type RemittanceAuth = {
  signedIn: boolean; busy: boolean; loading: boolean; available: boolean; error: string;
  signIn: () => void; cancel: () => void; retry?: () => void;
};

export const unavailableAuth: RemittanceAuth = {
  signedIn: false, busy: false, loading: false, available: false,
  error: "El acceso con Google todavía no está habilitado.", signIn: () => {}, cancel: () => {},
};

export function useRemittanceAuth(): RemittanceAuth {
  const { isAuthenticated, verified, configStatus, retryConfig, styles, getClient, login, logout } = usePollar();
  const client = getClient();
  const subscribe = useCallback((notify: () => void) => client.onAuthStateChange(() => notify()), [client]);
  // The SDK clones its state; React requires a stable snapshot between changes.
  const getSnapshot = useCallback(() => client.getAuthState().step, [client]);
  const step = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const signedIn = isAuthenticated && verified;
  const googleEnabled = Boolean(styles.providers?.google);
  return {
    signedIn,
    busy: !["idle", "error", "authenticated"].includes(step) || (isAuthenticated && !verified),
    loading: configStatus === "loading",
    available: signedIn || (configStatus === "ready" && googleEnabled),
    error: configStatus === "error" ? "No pudimos cargar el acceso. Revisa tu conexión e inténtalo de nuevo."
      : step === "error" ? "No se completó el inicio de sesión. Puedes volver a intentarlo."
      : configStatus === "ready" && !googleEnabled && !signedIn ? "El acceso con Google aún no está disponible." : "",
    signIn: () => login({ provider: "google" }),
    retry: configStatus === "error" ? retryConfig : undefined,
    cancel: () => { if (isAuthenticated && !verified) logout(); else client.cancelLogin(); },
  };
}
