import React from 'react';
import WindowFrame from '../WindowFrame/WindowFrame';
import WinampPlayer from '../WinampPlayer/WinampPlayer';
import { useTranslations } from 'next-intl';

import { useState } from 'react';
import HelpModal from '../HelpModal/HelpModal';

interface WinampWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

const WinampWindow: React.FC<WinampWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    const t = useTranslations();
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    if (!isOpen) return null;

    return (
        <>
            <WindowFrame
                id="winamp"
                title={t('Winamp.title')}
                onCloseClick={onClose}
                onHelpClick={() => setIsHelpOpen(true)}
                width="auto"
                height="auto"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <WinampPlayer />
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Winamp.title')}
                content={t('Winamp.help_content')}
            />
        </>
    );
};

export default WinampWindow;
