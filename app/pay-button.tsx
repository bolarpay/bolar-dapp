'use client';

import { usePollar } from "@pollar/react";

const USDC_ISSUER = process.env.NEXT_PUBLIC_USDC_ISSUER ?? '';
const PAYMENT_DESTINATION = process.env.NEXT_PUBLIC_PAYMENT_DESTINATION ?? '';

export function PayButton() {
    const { runTx } = usePollar();
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

    )
}