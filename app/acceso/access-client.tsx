"use client";

import dynamic from "next/dynamic";

// Pollar requires browser APIs; keep it out of server rendering and the landing.
const PollarApp = dynamic(() => import("../pollar-app"), {
  ssr: false,
  loading: () => <p role="status" className="py-12 text-center text-content-secondary">Preparando tu acceso…</p>,
});

export function AccessClient() {
  return <PollarApp />;
}
