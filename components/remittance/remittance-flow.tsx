"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { usePollar } from "@pollar/react";
import { RemittanceSteps, type RemittanceStepsProps } from "./remittance-steps";

function AuthenticatedFlow(props: RemittanceStepsProps) {
  const { isAuthenticated, verified, configStatus, retryConfig, styles, getClient, login, logout } = usePollar();
  const client = getClient();
  useEffect(() => () => client.cancelLogin(), [client]);
  const subscribe = useCallback((notify: () => void) => client.onAuthStateChange(() => notify()), [client]);
  // Pollar clones the state on every read. React needs a stable snapshot when
  // nothing changed; this UI only needs the primitive step, not that object.
  const getSnapshot = useCallback(() => client.getAuthState().step, [client]);
  const authStep = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const busy = !["idle", "error", "authenticated"].includes(authStep) || (isAuthenticated && !verified);
  const signedIn = isAuthenticated && verified;
  const googleEnabled = Boolean(styles.providers?.google);
  const error = configStatus === "error"
    ? "No pudimos cargar el acceso. Revisa tu conexión y vuelve a intentarlo."
    : authStep === "error"
      ? "No se completó el inicio de sesión. Puedes volver a intentarlo."
      : configStatus === "ready" && !googleEnabled && !signedIn
        ? "El acceso con Google aún no está disponible."
        : "";

  return <RemittanceSteps {...props} onClose={() => { client.cancelLogin(); props.onClose(); }} auth={{
    signedIn,
    busy,
    loading: configStatus === "loading",
    available: signedIn || (configStatus === "ready" && googleEnabled),
    error,
    signIn: () => login({ provider: "google" }),
    retry: configStatus === "error" ? retryConfig : undefined,
    cancel: () => { if (isAuthenticated && !verified) logout(); else client.cancelLogin(); },
  }} />;
}

export default function RemittanceFlow(props: RemittanceStepsProps) {
  const apiKey = process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY;
  if (!apiKey) return <RemittanceSteps {...props} auth={{
    signedIn: false, busy: false, loading: false, available: false,
    error: "El acceso todavía no está habilitado. Puedes completar los datos y volver cuando esté disponible.",
    signIn: () => {}, cancel: () => {},
  }} />;
  return <AuthenticatedFlow {...props} />;
}
