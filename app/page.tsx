'use client'

import { PollarProvider, usePollar } from '@pollar/react';

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
      onClick={() =>
        runTx('payment', {
          destination: '',
          amount: '10',
          asset: { type: 'credit_alphanum4', code: 'USDC', issuer: '' },
        })
      }
    >
      Send 10 USDC
    </button>
  );
}

export default function Home() {
  return (
    <PollarProvider client={{ apiKey: '' }}>
      <App />
    </PollarProvider>
  );
}