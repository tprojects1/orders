import React from 'react';
import './styles.scss';

const Button = ({ type, text, onClick, icon, action }) => {
    // Conditional rendering for classes and icon/text
    return (
        <button
            type={type}            
            className={`${action === 'close' ? 'close' : ''}`} // Apply 'close' class conditionally
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

        </button>
    );
};

export default Button;
