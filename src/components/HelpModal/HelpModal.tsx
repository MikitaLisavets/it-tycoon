import React from 'react';
import Modal from '../Modal/Modal';
import XPButton from '../XPButton/XPButton';
import styles from './HelpModal.module.css';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, title, content }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${title} - Help`}
            footer={<XPButton onClick={onClose}>OK</XPButton>}
        >
            <p>{content}</p>
        </Modal>
    );
};

export default HelpModal;
