'use client'

import { PollarProvider, usePollar, WalletButton, WalletButtonTemplate } from '@pollar/react';
import '@pollar/react/styles.css';
import './pollar-login-modal.css';

const USDC_ISSUER = process.env.NEXT_PUBLIC_USDC_ISSUER ?? '';
const PAYMENT_DESTINATION = process.env.NEXT_PUBLIC_PAYMENT_DESTINATION ?? '';

function App() {
  const { isAuthenticated, login, wallet, walletBalance, getClient, openLoginModal, runTx } = usePollar();
  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={openLoginModal}>Login</button>
        <WalletButton/>
        <button onClick={() => login({ provider: 'google' })}>
          Continue with Google
        </button>
      </div>
    );
  }
  return (
    <div>
    <p>{getClient().getUserProfile()?.mail}</p>
    <p>{getClient().getUserProfile()?.first_name} - {getClient().getUserProfile()?.last_name}</p>
    <img src={getClient().getUserProfile()?.avatar}></img>
    <p>{wallet?.address}</p>
    <WalletButton/>
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
    </div>
  );
}

export default function PollarApp() {
  return (
    <PollarProvider client={{ apiKey: process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY ?? '' }}>
      <App />
    </PollarProvider>
  );
}