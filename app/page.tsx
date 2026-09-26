'use client'

import dynamic from 'next/dynamic';

// PollarClient usa APIs del navegador: se renderiza solo en el cliente, sin SSR.
const PollarApp = dynamic(() => import('./pollar-app'), { ssr: false });

export default function Home() {
  return <PollarApp />;
}
