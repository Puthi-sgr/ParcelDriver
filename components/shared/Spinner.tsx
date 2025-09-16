import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-text-primary)]"></div>
    );
};

export default Spinner;