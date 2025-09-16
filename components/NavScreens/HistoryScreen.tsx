// FIX: Implemented HistoryScreen component to resolve module not found error.
import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { JobHistoryItem } from '../../types';
import Spinner from '../shared/Spinner';

const HistoryItemCard: React.FC<{ item: JobHistoryItem }> = ({ item }) => {
    const isCompleted = item.status === 'completed';
    const statusColor = isCompleted ? 'border-green-500' : 'border-red-500';
    const payoutColor = isCompleted ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]';
    const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className={`bg-[var(--color-surface)] p-4 rounded-xl shadow-sm border-l-4 ${statusColor}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg">{isCompleted ? `$${item.payout.toFixed(2)}` : 'Cancelled'}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{formattedDate}</p>
                </div>
                <div className={`text-sm font-semibold capitalize ${payoutColor}`}>{item.status}</div>
            </div>
            <div className="mt-3 text-sm space-y-2">
                <div>
                    <p className="text-xs text-[var(--color-text-secondary)]">FROM</p>
                    <p>{item.pickup}</p>
                </div>
                 <div>
                    <p className="text-xs text-[var(--color-text-secondary)]">TO</p>
                    <p>{item.dropoff}</p>
                </div>
            </div>
        </div>
    );
}

const HistoryScreen: React.FC = () => {
    const [history, setHistory] = useState<JobHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await mockApi.fetchJobHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to load history:", error);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <div className="flex items-center justify-center h-48"><Spinner /></div>;
        }
        if (history.length === 0) {
            return <div className="p-8 text-center text-[var(--color-text-secondary)]">No job history found.</div>;
        }
        return (
            <div className="space-y-4">
                {history.map(item => <HistoryItemCard key={item.id} item={item} />)}
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-background)] h-full">
            <header className="sticky top-0 z-10 p-4 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <h1 className="text-xl font-bold text-center">Job History</h1>
            </header>
            <main className="p-4 pb-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default HistoryScreen;