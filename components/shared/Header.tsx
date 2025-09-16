import React from 'react';
import { DriverState } from '../../types';
import Spinner from './Spinner';

interface HeaderProps {
    state: DriverState;
    loading?: boolean;
}

const stateDisplayMap: Record<DriverState, { text: string; color: string }> = {
    [DriverState.OFFLINE]: { text: 'Offline', color: 'bg-[var(--color-secondary)]' },
    [DriverState.IDLE]: { text: 'Idle - Searching for Jobs', color: 'bg-[var(--color-success)]' },
    [DriverState.OFFERING]: { text: 'New Offer!', color: 'bg-[var(--color-warning)] animate-pulse' },
    [DriverState.ASSIGNED]: { text: 'Job Assigned', color: 'bg-[var(--color-primary)]' },
    [DriverState.AT_PICKUP]: { text: 'At Pickup Location', color: 'bg-[var(--color-primary)]' },
    [DriverState.IN_TRANSIT]: { text: 'In Transit to Customer', color: 'bg-[var(--color-accent)]' },
    [DriverState.AT_DROPOFF]: { text: 'At Dropoff Location', color: 'bg-[var(--color-accent)]' },
    [DriverState.COMPLETED]: { text: 'Job Completed', color: 'bg-[var(--color-success)]' },
    [DriverState.EXCEPTION_HANDLING]: { text: 'Reporting Issue', color: 'bg-[var(--color-danger)]' },
};


const Header: React.FC<HeaderProps> = ({ state, loading }) => {
    const { text, color } = stateDisplayMap[state] || { text: 'Unknown', color: 'bg-gray-700' };

    return (
        <header className="bg-[var(--color-surface)] p-4 flex justify-between items-center border-b border-[var(--color-border)]">
            <div className="flex items-center">
                 <span className={`w-3 h-3 rounded-full mr-3 ${color}`}></span>
                 <h1 className="text-lg font-bold text-[var(--color-text-primary)]">{text}</h1>
            </div>
            {loading && <Spinner />}
        </header>
    );
};

export default Header;