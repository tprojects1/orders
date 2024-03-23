import React from 'react';
import './styles.scss';

const Tag = ({ text }) => {    
    return (        
        <span className={`tag ${text.toLowerCase()}`}>{text}</span>
    );
};

export default Tag;
