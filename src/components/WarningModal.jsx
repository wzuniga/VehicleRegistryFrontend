import { useEffect } from 'react';
import { useWarning } from '../context/WarningContext';
import './WarningModal.css';

const WarningModal = () => {
    const { isOpen, modalTitle, modalContent, closeWarning } = useWarning();

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeWarning();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeWarning]);

    if (!isOpen) return null;

    return (
        <div className="warning-modal-overlay" onClick={closeWarning}>
            <div className="warning-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="warning-modal-header">
                    <h3>{modalTitle}</h3>
                    <button className="close-btn" onClick={closeWarning}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="warning-modal-content">
                    {modalContent}
                </div>
                <div className="warning-modal-footer">
                    <button className="accept-btn" onClick={closeWarning}>
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarningModal;
