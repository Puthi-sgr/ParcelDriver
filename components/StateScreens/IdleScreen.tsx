import React from 'react';
import Button from '../shared/Button';
import Map from '../shared/Map';
import { AppContext } from '../../types';

interface IdleScreenProps {
  transition: (event: string) => void;
  context: AppContext;
}

const IdleScreen: React.FC<IdleScreenProps> = ({ transition }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full text-center p-4">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-1">Searching for jobs...</h2>
        <p className="text-[var(--color-text-secondary)]">We're looking for offers in your area.</p>
      </div>

      <Map isSearching={true} showLoadingRing={true} />

      <div className="w-full max-w-xs">
        <Button variant="secondary" onClick={() => transition('GO_OFFLINE')}>
          Go Offline
        </Button>
      </div>
    </div>
  );
};

export default IdleScreen;