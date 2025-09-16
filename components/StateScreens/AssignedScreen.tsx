import React from 'react';
import { AppContext } from '../../types';
import Button from '../shared/Button';
import InfoCard from '../shared/InfoCard';

interface AssignedScreenProps {
  context: AppContext;
  // FIX: Update transition prop to allow optional payload, fixing type error.
  transition: (event: string, payload?: any) => void;
}

const AssignedScreen: React.FC<AssignedScreenProps> = ({ context, transition }) => {
  const { job } = context;

  if (!job) {
    return <div className="text-center p-4">Loading job data...</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <InfoCard title="Pickup Location" details={[
          { label: "Address", value: job.pickup.address },
          { label: "Contact", value: job.pickup.contact },
          { label: "Notes", value: job.pickup.notes },
      ]}/>
      <div className="flex-grow" />
      <div className="space-y-4">
        <Button variant="primary" onClick={() => transition('ARRIVE_AT_PICKUP')}>
          Arrived at Pickup
        </Button>
        {/* FIX: Removed unused payload from REPORT_ISSUE call. */}
        <Button variant="danger" onClick={() => transition('REPORT_ISSUE')}>
          Report an Issue
        </Button>
      </div>
    </div>
  );
};

export default AssignedScreen;