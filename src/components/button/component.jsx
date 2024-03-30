import React from 'react';
import './styles.scss';

const Button = ({ children, type, text, onClick, icon, action, tier, isActive }) => {
    // Conditional rendering for classes and icon/text
    return (
        <button
            type={type}
            className={`${tier || ''} ${action || ''} ${isActive ? 'active' : ''}`}
            tabindex={`${isActive ? -1 : 0}`}
            onClick={onClick}
        >
            {action === 'close' ? <i className={`fa-solid fa-xmark`} /> :

                (icon ? (
                    <>
                        <i className={`fa-solid fa-${icon}`} />
                        <span>{text}</span>
                    </>
                ) : (
                    <>{text}</>
                ))

            }
            {children}
        </button>
    );
};

export default Button;
