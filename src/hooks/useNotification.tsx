"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAudio } from './useAudio';

export interface NotificationData {
    id: number;
    title: string;
    message: string;
    type: 'warning' | 'info' | 'error' | 'success';
    badge?: {
        stat: any; // keyof typeof STAT_ICONS
        value: string | number;
        prefix?: string;
    };
}

interface NotificationContextType {
    notification: NotificationData | null;
    showNotification: (title: string, message: string, type?: 'warning' | 'info' | 'error' | 'success', badge?: NotificationData['badge']) => void;
    dismissNotification: () => void;
    clearNotifications: () => void;
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

    const showNotification = useCallback((title: string, message: string, type: 'warning' | 'info' | 'error' | 'success' = 'info', badge?: NotificationData['badge']) => {
        const newNotification: NotificationData = {
            id: Date.now(),
            title,
            message,
            type,
            badge
        };
        if (type === 'warning' || type === 'error') {
            audio.playWarning();
        } else {
            audio.playNotification();
        }
        setQueue(prev => [...prev, newNotification]);
    }, [audio]);

    const dismissNotification = useCallback(() => {
        setNotification(null);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotification(null);
        setQueue([]);
    }, []);

    return (
        <NotificationContext.Provider value={{ notification, showNotification, dismissNotification, clearNotifications }}>
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
