import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const WarningContext = createContext();

export const useWarning = () => {
    const context = useContext(WarningContext);
    if (!context) {
        throw new Error('useWarning must be used within a WarningProvider');
    }
    return context;
};

export const WarningProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState(null);

    const openWarning = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setIsOpen(true);
    };

    const closeWarning = () => {
        setIsOpen(false);
        // Optional: Clear content after closing animation, but immediate clear is fine for now
        setModalTitle('');
        setModalContent(null);
    };

    const value = {
        isOpen,
        modalTitle,
        modalContent,
        openWarning,
        closeWarning
    };

    return (
        <WarningContext.Provider value={value}>
            {children}
        </WarningContext.Provider>
    );
};

WarningProvider.propTypes = {
    children: PropTypes.node.isRequired
};
