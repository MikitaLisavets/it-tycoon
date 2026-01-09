import React from 'react';

export const SolitaireIcon: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Card */}
        <rect x="6" y="4" width="20" height="26" rx="2" fill="white" stroke="#333" strokeWidth="1.5" />

        {/* Diamond Suit (Red) */}
        <path d="M16 10L20 15L16 20L12 15L16 10Z" fill="#D11" />

        {/* Stack effect */}
        <path d="M8 2L24 2" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 6V26" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

        {/* Corner Detail */}
        <rect x="8" y="6" width="4" height="4" rx="0.5" fill="#D11" opacity="0.2" />
    </svg>
);
