"use client";

import { useCallback } from 'react';
import { useGameState } from './useGameState';
import { LogEntry, LogType } from '@/lib/game/types';

export function useGameLogs() {
    const { state, updateState } = useGameState();

    const addLog = useCallback((type: LogType, text: string, data?: any) => {
        updateState(prev => {
            const newEntry: LogEntry = {
                id: Math.random().toString(36).substring(2, 11),
                type,
                text,
                timestamp: Date.now(),
                data
            };
            // Keep only latest 100 logs for performance
            const newLogs = [newEntry, ...(prev.logs || [])].slice(0, 100);
            return {
                logs: newLogs
            };
        });
    }, [updateState]);

    const logSolitaireWin = useCallback((text: string = "Won a game of Solitaire!") => {
        addLog('solitaire_win', text);
    }, [addLog]);

    const logSolitairePlay = useCallback((text: string = "Started a game of Solitaire") => {
        addLog('solitaire_play', text);
    }, [addLog]);

    const logMinesweeperPlay = useCallback((text: string = "Started a game of Minesweeper") => {
        addLog('minesweeper_play', text);
    }, [addLog]);

    const logSuccessfulHack = useCallback((targetId: string, text: string = `Successfully hacked ${targetId}`) => {
        addLog('hack_success', text, { targetId });
    }, [addLog]);

    const logEvent = useCallback((text: string, type: LogType = 'info', data?: any) => {
        addLog(type, text, data);
    }, [addLog]);

    return {
        logs: state.logs,
        logSolitaireWin,
        logSolitairePlay,
        logMinesweeperPlay,
        logSuccessfulHack,
        logEvent
    };
}
