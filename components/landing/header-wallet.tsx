"use client";

import dynamic from "next/dynamic";

// WalletButton depende del PollarProvider, que solo existe en el navegador.
export const HeaderWallet = dynamic(() => import("@pollar/react").then((m) => m.WalletButton), {
  ssr: false,
  loading: () => <span className="h-12 w-[192px] rounded-lg bg-field" aria-hidden="true" />,
});
