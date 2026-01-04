"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cheatManager } from '../../lib/game/cheats';
import { useGameState } from '../../hooks/useGameState';
import GameAudio, { GameAudioHandle } from '../GameAudio/GameAudio';
import styles from './CheatSystem.module.css';

const CHEATS = {
    PAINKILLER: 'PAINKILLER',
};

const CheatSystem: React.FC = () => {
    const [notification, setNotification] = useState<{ message: string; visible: boolean; exiting: boolean; active: boolean }>({
        message: '',
        visible: false,
        exiting: false,
        active: false
    });
    const inputBuffer = useRef<string>('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<GameAudioHandle>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input or textarea
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            // Only letter keys
            if (e.key.length !== 1 || !/[a-z]/i.test(e.key)) return;

            inputBuffer.current += e.key;

            // Limit buffer size (keep last 15 chars)
            if (inputBuffer.current.length > 15) {
                inputBuffer.current = inputBuffer.current.slice(-15);
            }

            // Check for cheats
            let matched = false;
            Object.entries(CHEATS).forEach(([code, type]) => {
                if (inputBuffer.current.endsWith(code)) {
                    const active = cheatManager.toggleCheat(type as any);
                    showNotification(code, active);
                    if (audioRef.current) {
                        audioRef.current.play();
                    }
                    inputBuffer.current = ''; // Clear after activation
                    matched = true;
                }
            });

            // Clear buffer if no key pressed for 3 seconds
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (!matched) {
                timeoutRef.current = setTimeout(() => {
                    inputBuffer.current = '';
                }, 3000);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const showNotification = (code: string, active: boolean) => {
        setNotification({
            message: `Cheat '${code}' has been ${active ? 'activated' : 'deactivated'}.`,
            visible: true,
            exiting: false,
            active
        });

        setTimeout(() => {
            setNotification(prev => ({ ...prev, exiting: true }));
            setTimeout(() => {
                setNotification(prev => ({ ...prev, visible: false, exiting: false }));
            }, 500);
        }, 3000);
    };

    return (
        <>
            <GameAudio ref={audioRef} src="/sfx/cheat.mp3" />
            {notification.visible && (
                <div className={`${styles.notification} ${notification.exiting ? styles.exit : ''}`}>
                    <div className={styles.titleBar}>
                        <div className={styles.title}>
                            <span>System notification</span>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.icon}>
                            {notification.active ? '✅' : '❌'}
                        </div>
                        <div className={styles.message}>
                            {notification.message}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CheatSystem;
