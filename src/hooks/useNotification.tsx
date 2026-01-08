"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAudio } from './useAudio';

export interface NotificationData {
    id: number;
    title: string;
    message: string;
    type: 'warning' | 'info';
    badge?: {
        stat: any; // keyof typeof STAT_ICONS
        value: string | number;
        prefix?: string;
    };
}

interface NotificationContextType {
    notification: NotificationData | null;
    showNotification: (title: string, message: string, type?: 'warning' | 'info', badge?: NotificationData['badge']) => void;
    dismissNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<NotificationData | null>(null);
    const [queue, setQueue] = useState<NotificationData[]>([]);
    const audio = useAudio();
    // Queue Processor - when current notification is dismissed, show next in queue
    useEffect(() => {
        if (!notification && queue.length > 0) {
            const next = queue[0];
            setNotification(next);
            setQueue(prev => prev.slice(1));
        }
    }, [notification, queue]);

    const showNotification = useCallback((title: string, message: string, type: 'warning' | 'info' = 'info', badge?: NotificationData['badge']) => {
        const newNotification: NotificationData = {
            id: Date.now(),
            title,
            message,
            type,
            badge
        };
        if (type === 'warning') {
            audio.playWarning();
        } else {
            audio.playNotification();
        }
        setQueue(prev => [...prev, newNotification]);
    }, []);

    const dismissNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ notification, showNotification, dismissNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
