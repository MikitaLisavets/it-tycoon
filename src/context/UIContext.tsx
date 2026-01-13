"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
    isAboutModalOpen: boolean;
    openAboutModal: () => void;
    closeAboutModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    const openAboutModal = () => setIsAboutModalOpen(true);
    const closeAboutModal = () => setIsAboutModalOpen(false);

    return (
        <UIContext.Provider value={{ isAboutModalOpen, openAboutModal, closeAboutModal }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUIContext = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUIContext must be used within a UIProvider');
    }
    return context;
};
