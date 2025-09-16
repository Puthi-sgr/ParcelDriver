import React from 'react';
import { AppContext } from '../../types';
import Button from '../shared/Button';

interface CompletedScreenProps {
  context: AppContext;
  transition: (event: string) => void;
}

const CompletedScreen: React.FC<CompletedScreenProps> = ({ context, transition }) => {
  const { settlement } = context;

  if (!settlement) {
    return <div className="text-center p-4">Calculating earnings...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-3xl font-bold text-[var(--color-success)] mb-2">Job Complete!</h2>
      <p className="text-[var(--color-text-secondary)] mb-8">You've successfully completed the delivery.</p>

      <div className="bg-[var(--color-surface)] w-full p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4">Earnings Summary</h3>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Payout:</span>
            <span>${settlement.payout.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Bonus:</span>
            <span>${settlement.bonus.toFixed(2)}</span>
          </div>
          <hr className="border-[var(--color-border)] my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-[var(--color-success)]">${settlement.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-xs">
        <Button variant="primary" onClick={() => transition('ACKNOWLEDGE_SETTLEMENT')}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default CompletedScreen;