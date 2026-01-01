"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './PWAUpdater.module.css';

const PWAUpdater: React.FC = () => {
    const t = useTranslations('PWAUpdate');
    const [showUpdate, setShowUpdate] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            // Check for updates on load
            navigator.serviceWorker.getRegistration().then((reg) => {
                if (reg) {
                    setRegistration(reg);
                    if (reg.waiting) {
                        setShowUpdate(true);
                    }

                    // Listen for new service workers
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    setShowUpdate(true);
                                }
                            });
                        }
                    });
                }
            });

            // Handle controller change (reload after skipWaiting)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }
    }, []);

    const handleUpdate = () => {
        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        setShowUpdate(false);
    };

    if (!showUpdate) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.window}>
                <div className={styles.titleBar}>
                    <div className={styles.title}>{t('title')}</div>
                    <div className={styles.controls}>
                        <button className={styles.closeBtn} onClick={() => setShowUpdate(false)}>X</button>
                    </div>
                </div>
                <div className={styles.content}>
                    <p className={styles.message}>{t('message')}</p>
                    <div className={styles.actions}>
                        <button className={styles.xpButton} onClick={handleUpdate}>{t('update')}</button>
                        <button className={styles.xpButton} onClick={() => setShowUpdate(false)}>{t('later')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PWAUpdater;
