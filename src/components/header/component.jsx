import React, { useEffect } from 'react';
import './styles.scss';

const Header = ({ text }) => {

    useEffect(() => {
        setTimeout(() => {
            document.querySelector('header')?.classList.remove('hidden');
        }, 500);
    }, []);

    return (
        <header className='hidden'>
            <div>
                <h1>{text}</h1>
            </div>
        </header>
    );
};

export default Header;