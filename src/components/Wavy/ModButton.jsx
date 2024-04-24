import React from 'react';

const ModButton = ({ label, active, onClick }) => {
    return <button
    className = {`modButton ${active ? 'active' : 'inactive'}`}
        onClick={onClick}
        aria-pressed={active}
    >
        {label}
    </button>;
};

export default ModButton;





