import styles from './Modal.module.css';
import { useAudio } from '../../hooks/useAudio';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
    zIndex?: number;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, width, zIndex }) => {
    const { playClick } = useAudio();
    if (!isOpen) return null;

    const handleClose = () => {
        playClick();
        onClose();
    };

    return (
        <div className={styles.overlay} style={zIndex ? { zIndex } : undefined}>
            <div className={styles.modalContent} style={width ? { width } : undefined}>
                <div className={styles.header}>
                    <span>{title}</span>
                    <button className={styles.closeBtn} onClick={handleClose}>X</button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
                {footer && (
                    <div className={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
