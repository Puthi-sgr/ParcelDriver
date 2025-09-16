import React from 'react';
import { AppContext } from '../../types';
import Button from '../shared/Button';
import CountdownTimer from '../shared/CountdownTimer';
import { OFFER_COUNTDOWN_SECONDS } from '../../constants';
import Map from '../shared/Map';

interface OfferingScreenProps {
  context: AppContext;
  transition: (event: string, payload?: any) => void;
}

const OfferingScreen: React.FC<OfferingScreenProps> = ({ context, transition }) => {
  const { offer } = context;

  if (!offer) {
    return <div className="text-center p-4">Waiting for offer data...</div>;
  }

  const handleTimeout = () => {
    transition('TIMEOUT_OFFER');
  };

  return (
    <div className="flex flex-col justify-end h-full bg-[var(--color-background)]">
      {/* Map in the background */}
      <div className="absolute top-0 left-0 right-0 h-1/2 flex items-center justify-center">
        <Map showRouteAnimation={true} />
      </div>

      {/* Bottom Sheet */}
      <div className="bg-[var(--color-surface)] rounded-t-2xl shadow-2xl p-4 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">New Offer!</h2>
            <p className="text-4xl font-extrabold text-[var(--color-primary)]">${offer.estimatedPayout.toFixed(2)}</p>
          </div>
          <CountdownTimer
            expiryTimestamp={offer.expiresAt}
            totalDuration={OFFER_COUNTDOWN_SECONDS}
            onComplete={handleTimeout}
            size={80}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] text-left">
            <div className="mb-3">
              <p className="text-xs text-[var(--color-text-secondary)]">PICKUP</p>
              <p className="font-medium">{offer.pickup}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-secondary)]">DROPOFF</p>
              <p className="font-medium">{offer.dropoff}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="danger" onClick={() => transition('REJECT_OFFER')}>
              Reject
            </Button>
            <Button variant="success" onClick={() => transition('ACCEPT_OFFER')}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferingScreen;
