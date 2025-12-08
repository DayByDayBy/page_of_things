import React from 'react';
import FormulaTooltip from './FormulaTooltip';

const ModButton = ({ 
    label, 
    active, 
    description, 
    formula, 
    onClick, 
    isMain, 
    disabled, 
    className 
}) => {

    const buttonClassName = `modButton ${active ? 'active' : 'inactive'} ${isMain ? 'mainModButton' : ''} ${disabled ? 'disabled' : ''} ${className || ''}`;

    return (
        <button
            className={buttonClassName}
            onClick={disabled ? undefined : onClick}
            aria-pressed={active}
            aria-label={description || undefined}
            disabled={disabled}
        >
            {label}
            {formula && <FormulaTooltip formula={formula} />}
        </button>
    );
};

export default ModButton;