"use client";

import { GameStateProvider, useGameState } from "@/hooks/useGameState";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useMemo } from "react";
import enMessages from "../../messages/en.json";
import deMessages from "../../messages/de.json";

const messagesMap: Record<string, any> = {
    en: enMessages,
    de: deMessages,
};

function LanguageProvider({ children }: { children: ReactNode }) {
    const { state, isInitialized } = useGameState();

    const messages = useMemo(() => {
        return messagesMap[state.locale] || enMessages;
    }, [state.locale]);

    if (!isInitialized) {
        return null;
    }

    return (
        <NextIntlClientProvider
            key={state.locale}
            locale={state.locale}
            messages={messages}
        >
            {children}
        </NextIntlClientProvider>
    );
}

export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <GameStateProvider>
            <LanguageProvider>{children}</LanguageProvider>
        </GameStateProvider>
    );
}
