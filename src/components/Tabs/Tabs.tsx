import React from 'react';
import styles from './Tabs.module.css';
import { useAudio } from '@/hooks/useAudio';

export interface TabItem<T extends string> {
    readonly id: T;
    readonly label: string;
}

interface TabsProps<T extends string> {
    readonly tabs: readonly TabItem<T>[] | ReadonlyArray<TabItem<T>>;
    activeTab: T;
    onTabChange: (tabId: T) => void;
    className?: string;
}

interface TabContentProps<T extends string> {
    children: React.ReactNode;
}

export function Tabs<T extends string>({ tabs, activeTab, onTabChange, className }: TabsProps<T>) {
    const audio = useAudio();

    const handleTabChange = (tabId: T) => {
        audio.playClick();
        onTabChange(tabId);
    };

    return (
        <div className={`${styles.tabs} ${className || ''}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => handleTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export function TabContent<T extends string>({ children }: TabContentProps<T>) {
    return (
        <div className={styles.content}>
            {children}
        </div>
    );
}

export default Tabs;
