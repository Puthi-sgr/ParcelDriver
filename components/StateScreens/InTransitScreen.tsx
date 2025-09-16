import React from 'react';
import { AppContext } from '../../types';
import Button from '../shared/Button';
import InfoCard from '../shared/InfoCard';

interface InTransitScreenProps {
  context: AppContext;
  transition: (event: string) => void;
}

const InTransitScreen: React.FC<InTransitScreenProps> = ({ context, transition }) => {
  const { job } = context;

  if (!job) return null;

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <InfoCard title="Next Stop: Dropoff" details={[
          { label: "Address", value: job.dropoff.address },
          { label: "Contact", value: job.dropoff.contact },
          { label: "Notes", value: job.dropoff.notes },
      ]}/>
       <div className="flex-grow" />
      <div className="space-y-4">
        <Button variant="primary" onClick={() => transition('ARRIVE_AT_DROPOFF')}>
          Arrived at Dropoff
        </Button>
        <Button variant="danger" onClick={() => transition('REPORT_ISSUE')}>
          Report an Issue
        </Button>
      </div>
    </div>
  );
};

export default InTransitScreen;