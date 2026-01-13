import React from 'react';
import InfoModal from '../InfoModal/InfoModal';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
    hideHelpSuffix?: boolean;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, title, content, hideHelpSuffix }) => {
    return (
        <InfoModal
            isOpen={isOpen}
            onClose={onClose}
            title={hideHelpSuffix ? title : `${title} - Help`}
        >
            {typeof content === 'string' ? <p>{content}</p> : content}
        </InfoModal>
    );
};

export default HelpModal;
