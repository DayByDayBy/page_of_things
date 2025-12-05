import React from 'react';

const ModButton = ({ label, active, description, onClick, isMain, disabled }) => {
    const buttonClassName = `modButton ${active ? 'active' : 'inactive'} ${isMain ? 'mainModButton' : ''}`;

    
    return <button
    className = {buttonClassName}
        onClick={onClick}
        aria-pressed={active}
        aria-label={description}
        disabled={disabled}
    >
        {label}
        
    </button>;
};

export default ModButton;





