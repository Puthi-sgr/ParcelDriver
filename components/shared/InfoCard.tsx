import React from 'react';

interface InfoCardProps {
    title: string;
    details: Array<{ label: string; value: string; }>;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, details }) => {
    return (
        <div className="bg-[var(--color-surface)] rounded-xl p-4 shadow-md w-full">
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-3">{title}</h3>
            <div className="space-y-2">
                {details.map(detail => (
                     <div key={detail.label}>
                        <p className="text-xs text-[var(--color-text-secondary)]">{detail.label}</p>
                        <p className="font-medium text-[var(--color-text-primary)]">{detail.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoCard;