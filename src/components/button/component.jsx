import React, { useEffect } from 'react';
import './styles.scss';

const Button = ({ children, type, text, onClick, icon, action, tier, isActive, isDisabled }) => {    
    useEffect(() => {        
        // Add a keydown event listener to the document
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && action === 'close') {
                onClick(); // Trigger the same function as click
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Clean up the listener on unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [action, onClick]); // Only re-run the effect if the action or onClick event changes

    return (
        <button
            type={type}
            className={`${tier || ''} ${action || ''} ${isActive ? 'active' : ''}`}            
            onClick={onClick}
            disabled={isDisabled}
        >
            {action === 'close' ? <i className={`fa-solid fa-xmark`} /> : (
                icon ? (
                    <>
                        <i className={`fa-solid fa-${icon}`} />
                        <span>{text}</span>
                    </>
                ) : (
                    <>{text}</>
                )
            )}
            {children}
        </button>
    );
};

export default Button;
