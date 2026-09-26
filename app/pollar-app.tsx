'use client'

import { PollarProvider, usePollar } from '@pollar/react';

const USDC_ISSUER = process.env.NEXT_PUBLIC_USDC_ISSUER ?? '';
const PAYMENT_DESTINATION = process.env.NEXT_PUBLIC_PAYMENT_DESTINATION ?? '';

function App() {
  const { isAuthenticated, login, runTx } = usePollar();
  if (!isAuthenticated) {
    return (
      <button onClick={() => login({ provider: 'google' })}>
        Continue with Google
      </button>
    );
  }
  return (
    <button
      disabled={!USDC_ISSUER || !PAYMENT_DESTINATION}
      onClick={() =>
        runTx('payment', {
          destination: PAYMENT_DESTINATION,
          amount: '10',
          asset: { type: 'credit_alphanum4', code: 'USDC', issuer: USDC_ISSUER },
        })
      }
    >
      Send 10 USDC
    </button>
  );
}

export default function PollarApp() {
  return (
    <PollarProvider client={{ apiKey: process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY ?? '' }}>
      <App />
    </PollarProvider>
  );
}