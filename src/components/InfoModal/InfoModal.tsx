import React from 'react';
import { useTranslations } from 'next-intl';
import Modal from '../Modal/Modal';
import XPButton from '../XPButton/XPButton';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
    zIndex?: number;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, children, width, zIndex }) => {
    const t = useTranslations();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            width={width}
            zIndex={zIndex}
            footer={<XPButton onClick={onClose}>{t('Common.ok')}</XPButton>}
        >
            {children}
        </Modal>
    );
};

export default InfoModal;
