import React from 'react';
import WindowFrame from '../WindowFrame/WindowFrame';
import WinampPlayer from '../WinampPlayer/WinampPlayer';

interface WinampWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

const WinampWindow: React.FC<WinampWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    if (!isOpen) return null;

    return (
        <WindowFrame
            id="winamp"
            title="Music Player"
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
