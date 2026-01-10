import React from 'react';
import WindowFrame from '../WindowFrame/WindowFrame';
import DesktopShortcut from '../DesktopShortcut/DesktopShortcut';
import styles from './ApplicationWindow.module.css';
import { useTranslations } from 'next-intl';
import { useGameState } from '@/hooks/useGameState';
import { SolitaireIcon, NotepadIcon, OfficeIcon, CodeEditorIcon, WebWalletIcon, InvestorIcon, WinampIcon } from '../Icons/AppIcons';

interface ApplicationWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused: boolean;
    onFocus: () => void;
    onOpenApp: (id: string) => void;
}

const ApplicationWindow: React.FC<ApplicationWindowProps> = ({
    isOpen,
    onClose,
    isFocused,
    onFocus,
    onOpenApp,
}) => {
    const t = useTranslations();
    const { state } = useGameState();

    const isSolitaireOwned = state.software.games.includes('solitaire');

    if (!isOpen) return null;

    return (
        <WindowFrame
            id="applications_window"
            title={t('Applications.title')}
            onCloseClick={onClose}
            onHelpClick={() => { }}
            width="400px"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <div className={styles.grid}>
                <DesktopShortcut
                    id="winamp"
                    label={t('Winamp.title')}
                    icon={<WinampIcon />}
                    onDoubleClick={onOpenApp}
                />
                {isSolitaireOwned && (
                    <DesktopShortcut
                        id="solitaire"
                        label={t('Values.solitaire')}
                        icon={<SolitaireIcon />}
                        onDoubleClick={onOpenApp}
                    />
                )}
                {state.software.programs.includes('software_office') && (
                    <DesktopShortcut
                        id="software_office"
                        label={t('Values.software_office')}
                        icon={<OfficeIcon />}
                        onDoubleClick={onOpenApp}
                    />
                )}
                {state.software.programs.includes('software_notepad') && (
                    <DesktopShortcut
                        id="software_notepad"
                        label={t('Values.software_notepad')}
                        icon={<NotepadIcon />}
                        onDoubleClick={onOpenApp}
                    />
                )}
                {state.software.programs.includes('software_code_editor') && (
                    <DesktopShortcut
                        id="software_code_editor"
                        label={t('Values.software_code_editor')}
                        icon={<CodeEditorIcon />}
                        onDoubleClick={onOpenApp}
                    />
                )}
                {state.software.programs.includes('software_web_wallet') && (
                    <DesktopShortcut
                        id="software_web_wallet"
                        label={t('Values.software_web_wallet')}
                        icon={<WebWalletIcon />}
                        onDoubleClick={onOpenApp}
                    />
                )}
                {state.software.programs.includes('software_investor') && (
                    <DesktopShortcut
                        id="software_investor"
                        label={t('Values.software_investor')}
                        icon={<InvestorIcon />}
                        onDoubleClick={onOpenApp}
                    />
                )}
            </div>
        </WindowFrame>
    );
};

export default ApplicationWindow;
