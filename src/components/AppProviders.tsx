"use client";

import { GameStateProvider, useGameState } from "@/hooks/useGameState"; // Ensure import path is correct
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import enMessages from "../../messages/en.json";
import deMessages from "../../messages/de.json"; // Assuming de.json exists or will be handled. Since only en exists currently, I might need to handle this.

// Simple message loader (for now importing directly)
const messagesMap: Record<string, any> = {
    en: enMessages,
    de: deMessages,
};

function LanguageProvider({ children }: { children: ReactNode }) {
    const { state, isInitialized } = useGameState();
    const [messages, setMessages] = useState(enMessages);

    useEffect(() => {
        if (state.locale && messagesMap[state.locale]) {
            setMessages(messagesMap[state.locale]);
        }
    }, [state.locale]);

    // Prevent flash of wrong content or hydration mismatch if needed
    // But for now, since we default to 'en', it might be fine.
    // However, if saved state is 'de', we might want to wait for init.
    if (!isInitialized) {
        return null; // or a loading spinner
    }

    return (
        <NextIntlClientProvider locale={state.locale} messages={messages}>
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
