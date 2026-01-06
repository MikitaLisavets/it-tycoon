import React from 'react';
import WindowFrame from '../WindowFrame/WindowFrame';
import WinampPlayer from '../WinampPlayer/WinampPlayer';
import { useTranslations } from 'next-intl';

interface WinampWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

const WinampWindow: React.FC<WinampWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    if (!isOpen) return null;

    const t = useTranslations('Winamp');

    return (
        <WindowFrame
            id="winamp"
            title={t('title')}
            onCloseClick={onClose}
            width="auto"
            height="auto"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <WinampPlayer />
        </WindowFrame>
    );
};

export default WinampWindow;
