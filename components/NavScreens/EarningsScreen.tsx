import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { EarningsData, Period } from '../../types';
import Spinner from '../shared/Spinner';
import Button from '../shared/Button';

// Helper components
const SummaryCard: React.FC<{ title: string; value: string; note?: string; colorClass?: string }> = ({ title, value, note, colorClass = 'text-[var(--color-primary)]' }) => (
    <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow-sm flex-1">
        <p className="text-sm text-[var(--color-text-secondary)]">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        {note && <p className="text-xs text-[var(--color-text-secondary)] mt-1">{note}</p>}
    </div>
);

const BreakdownRow: React.FC<{ label: string; value: number; isNegative?: boolean }> = ({ label, value, isNegative = false }) => (
    <div className="flex justify-between items-center py-2 text-sm">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <span className={isNegative ? 'text-[var(--color-danger)]' : ''}>
            {isNegative ? '-' : ''}${Math.abs(value).toFixed(2)}
        </span>
    </div>
);

const EarningsScreen: React.FC = () => {
    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<Period>('today');
    const periods: Period[] = ['today', 'week', 'month'];

    useEffect(() => {
        const loadEarnings = async () => {
            setLoading(true);
            try {
                const data = await mockApi.fetchEarningsDetails(period);
                setEarnings(data);
            } catch (error) {
                console.error("Failed to load earnings:", error);
                // Handle error state if necessary
            } finally {
                setLoading(false);
            }
        };
        loadEarnings();
    }, [period]);

    const renderContent = () => {
        if (loading) {
            return <div className="flex items-center justify-center h-48"><Spinner /></div>;
        }
        if (!earnings) {
            return <div className="p-8 text-center">Could not load earnings details.</div>;
        }
        
        return (
            <>
                <div className="flex gap-4">
                    <SummaryCard title="Net Earnings" value={`$${earnings.net.toFixed(2)}`} note={`For this ${period}`} />
                    <SummaryCard title="Wallet Balance" value={`$${earnings.walletBalance.toFixed(2)}`} note="Available" />
                </div>
                
                { (earnings.pending > 0 || earnings.codToRemit > 0) && (
                    <div className="flex gap-4 mt-4 text-center justify-center">
                        {earnings.pending > 0 && <div className="text-sm bg-slate-100 py-1 px-3 rounded-full"><span className="font-semibold">${earnings.pending.toFixed(2)}</span> Pending</div>}
                        {earnings.codToRemit > 0 && <div className="text-sm bg-red-100 text-red-800 py-1 px-3 rounded-full font-semibold">⚠️ ${earnings.codToRemit.toFixed(2)} COD to Remit</div>}
                    </div>
                )}
                
                <section className="bg-[var(--color-surface)] rounded-xl shadow-sm mt-6">
                    <h2 className="p-3 text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border)] bg-slate-50 rounded-t-xl">Breakdown</h2>
                    <div className="p-4 divide-y divide-[var(--color-border)]">
                        <BreakdownRow label="Gross Fares" value={earnings.breakdown.gross} />
                        <BreakdownRow label="Tips" value={earnings.breakdown.tips} />
                        <BreakdownRow label="Bonuses" value={earnings.breakdown.bonus} />
                        <BreakdownRow label="Platform Fees" value={earnings.breakdown.platformFee} isNegative />
                        <BreakdownRow label="Tax / Withholding" value={earnings.breakdown.tax} isNegative />
                        <div className="flex justify-between items-center pt-3 mt-2 font-bold">
                            <span>Net Earnings</span>
                            <span className="text-[var(--color-primary)]">${earnings.net.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
                
                <section className="bg-[var(--color-surface)] rounded-xl shadow-sm mt-6 p-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-secondary)]">Next Payout</span>
                        <div className="text-right font-semibold">
                            <p>{new Date(earnings.nextPayout.eta).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            <p className="text-xs text-[var(--color-text-secondary)] capitalize">{earnings.nextPayout.method} ending in {earnings.nextPayout.last4}</p>
                        </div>
                    </div>
                </section>

                <div className="mt-6 space-y-3">
                    <Button variant="primary">Request Payout</Button>
                    <Button variant="secondary">Export Statement</Button>
                </div>
            </>
        );
    }

    return (
        <div className="bg-[var(--color-background)] h-full">
            <header className="sticky top-0 z-10 p-4 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <h1 className="text-xl font-bold text-center">Earnings</h1>
            </header>
            <main className="p-4 pb-8">
                <div className="flex justify-center p-1 bg-slate-100 rounded-xl mb-6">
                    {periods.map(p => (
                        <button 
                            key={p} 
                            onClick={() => setPeriod(p)}
                            className={`w-full py-1.5 text-sm font-semibold capitalize rounded-lg transition-colors duration-200 ${period === p ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:bg-slate-200/50'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default EarningsScreen;