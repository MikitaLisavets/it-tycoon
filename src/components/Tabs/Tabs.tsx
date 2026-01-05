import React from 'react';
import styles from './Tabs.module.css';

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

export function Tabs<T extends string>({ tabs, activeTab, onTabChange, className }: TabsProps<T>) {
    return (
        <div className={`${styles.tabs} ${className || ''}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default Tabs;
