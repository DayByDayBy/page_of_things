import React from 'react';

const ModButton = ({ label, active, description, onClick, isMain, disabled, className }) => {
    const buttonClassName = `modButton ${active ? 'active' : 'inactive'} ${isMain ? 'mainModButton' : ''} ${disabled ? 'disabled' : ''} ${className || ''}`;

    return <button
        className={buttonClassName}
        onClick={disabled ? undefined : onClick}
        aria-pressed={active}
        aria-label={description || undefined}
        disabled={disabled}
    >
        {label}
    </button>;
};

export default ModButton;


