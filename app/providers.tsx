"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { PollarProvider } from "@pollar/react";
import "@pollar/react/styles.css";
import "./pollar-login-modal.css";

// Única instancia del cliente para toda la app. Debe ser un objeto estable:
// PollarProvider fija el cliente en el primer render.
const pollarConfig = { apiKey: process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY ?? "" };

const noopSubscribe = () => () => {};

export function Providers({ children }: { children: ReactNode }) {
  // false en el servidor y durante la hidratación, true justo después.
  // PollarClient usa APIs del navegador, así que el provider se monta solo en el
  // cliente. Hidratar el mismo árbol que el servidor es obligatorio: un
  // `typeof window` aquí cambia la forma del árbol y con ella los ids de
  // useId(), lo que provoca un hydration mismatch. Al montar el provider el
  // árbol hijo se vuelve a montar una vez.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!mounted) return children;
  return <PollarProvider client={pollarConfig}>{children}</PollarProvider>;
}
