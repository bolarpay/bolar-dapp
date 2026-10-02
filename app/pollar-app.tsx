'use client'

import { PollarProvider, WalletButton } from '@pollar/react';
import '@pollar/react/styles.css';
import './header.css';
import { LoginButton } from './login-button';
import { PayButton } from './pay-button';

function App() {
  return (
    <header className="app-header">
      <h1 className="app-header__title">Bolar</h1>
      <div className="app-header__wallet">
        <WalletButton />
      </div>
      <LoginButton />
      <PayButton />
    </header>
  );
}

export default function PollarApp() {
  return (
    <PollarProvider client={{ apiKey: process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY ?? '' }}>
      <App />
    </PollarProvider>
  );
}