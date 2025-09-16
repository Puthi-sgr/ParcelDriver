import React from 'react';
import { View } from '../../App';

interface NavigationBarProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const JobIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isActive ? 'var(--color-primary)' : 'currentColor'} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5a9.37 9.37 0 00-6.26 2.57 9.37 9.37 0 00-2.57 6.26c0 4.1 2.33 7.64 5.7 8.92.54.2 1.1.3 1.66.3s1.12-.1 1.66-.3c3.37-1.28 5.7-4.82 5.7-8.92a9.37 9.37 0 00-2.57-6.26A9.37 9.37 0 0012 1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.5v7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12h7" />
    </svg>
);

const HistoryIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isActive ? 'var(--color-primary)' : 'currentColor'} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const EarningsIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isActive ? 'var(--color-primary)' : 'currentColor'} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
);

const AccountIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isActive ? 'var(--color-primary)' : 'currentColor'} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


const navItems = [
    { id: 'job', label: 'Job', icon: JobIcon },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'earnings', label: 'Earnings', icon: EarningsIcon },
    { id: 'account', label: 'Account', icon: AccountIcon },
];

const NavigationBar: React.FC<NavigationBarProps> = ({ activeView, onNavigate }) => {
    return (
        <nav className="flex justify-around items-center bg-[var(--color-surface)] border-t border-[var(--color-border)]">
            {navItems.map((item) => {
                const isActive = activeView === item.id;
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id as View)}
                        className={`flex flex-col items-center justify-center w-full py-2 text-xs font-medium focus:outline-none transition-colors duration-200 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        <Icon isActive={isActive} />
                        <span className="mt-1">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default NavigationBar;