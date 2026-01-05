"use client";

import { GameStateProvider, useGameState } from "@/hooks/useGameState";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useMemo } from "react";
import enMessages from "../../messages/en.json";
import deMessages from "../../messages/de.json";
import enQuizzes from "../../messages/en-quizzes.json";
import deQuizzes from "../../messages/de-quizzes.json";

// Deep merge helper function
function deepMerge(target: any, source: any): any {
    const output = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            output[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            output[key] = source[key];
        }
    }
    return output;
}

const messagesMap: Record<string, any> = {
    en: deepMerge(enMessages, enQuizzes),
    de: deepMerge(deMessages, deQuizzes),
};

function LanguageProvider({ children }: { children: ReactNode }) {
    const { state, isInitialized } = useGameState();

    const messages = useMemo(() => {
        return messagesMap[state.locale] || messagesMap.en;
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
