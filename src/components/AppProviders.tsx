"use client";

import { GameStateProvider, useGameState } from "@/hooks/useGameState";
import { NotificationProvider } from "@/hooks/useNotification";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useMemo } from "react";
import AudioManager from "./AudioManager/AudioManager";
import enMessages from "../../messages/en.json";
import deMessages from "../../messages/de.json";
import ruMessages from "../../messages/ru.json";
import svMessages from "../../messages/sv.json";
import plMessages from "../../messages/pl.json";
import frMessages from "../../messages/fr.json";
import esMessages from "../../messages/es.json";

import enQuizzes from "../../messages/en-quizzes.json";
import deQuizzes from "../../messages/de-quizzes.json";
import ruQuizzes from "../../messages/ru-quizzes.json";
import svQuizzes from "../../messages/sv-quizzes.json";
import plQuizzes from "../../messages/pl-quizzes.json";
import frQuizzes from "../../messages/fr-quizzes.json";
import esQuizzes from "../../messages/es-quizzes.json";

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
    ru: deepMerge(ruMessages, ruQuizzes),
    sv: deepMerge(svMessages, svQuizzes),
    pl: deepMerge(plMessages, plQuizzes),
    fr: deepMerge(frMessages, frQuizzes),
    es: deepMerge(esMessages, esQuizzes),
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

import { UIProvider } from "@/context/UIContext";

export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <UIProvider>
            <GameStateProvider>
                <LanguageProvider>
                    <AudioManager>
                        <NotificationProvider>
                            {children}
                        </NotificationProvider>
                    </AudioManager>
                </LanguageProvider>
            </GameStateProvider>
        </UIProvider>
    );
}
