'use client';

import { usePollar, WalletButton } from '@pollar/react';

export function LoginButton() {
    const { isAuthenticated, login, logout, wallet, walletBalance, getClient, openLoginModal, runTx } = usePollar();

    if (isAuthenticated) {
        return (
            <div>
                <p>{getClient().getUserProfile()?.mail}</p>
                <p>{getClient().getUserProfile()?.first_name} - {getClient().getUserProfile()?.last_name}</p>
                <img src={getClient().getUserProfile()?.avatar}></img>
                <p>{wallet?.address}</p>
                <button type="button" onClick={() => logout()}>Cerrar sesión</button>
            </div>
        );
    }

    return (
        <button type="button" onClick={openLoginModal}>Iniciar sesión</button>
    )
}