import React from 'react';
import Button from '../shared/Button';
import Map from '../shared/Map';
import { AppContext } from '../../types';

interface OfflineScreenProps {
  transition: (event: string) => void;
  context: AppContext;
}

const OfflineScreen: React.FC<OfflineScreenProps> = ({ transition }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full text-center p-4">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-1">You are Offline</h2>
        <p className="text-[var(--color-text-secondary)]">Go online to start receiving job offers.</p>
      </div>
      
      <Map isSearching={false} />

      <div className="w-full max-w-xs">
        <Button variant="primary" onClick={() => transition('GO_ONLINE')}>
          Go Online
        </Button>
      </div>
    </div>
  );
};

export default OfflineScreen;
