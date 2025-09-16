import React, { useState } from 'react';
import { AppContext, Proof, Task, ProofType } from '../../types';
import Button from '../shared/Button';
import ChecklistItem from '../shared/ChecklistItem';

interface AtPickupScreenProps {
  context: AppContext;
  // FIX: Made payload optional to fix error on transition calls without a payload.
  transition: (event: string, payload?: any) => void;
}

const AtPickupScreen: React.FC<AtPickupScreenProps> = ({ context, transition }) => {
  const { job } = context;
  const [proof, setProof] = useState<Proof>({ photos: [] });
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  if (!job) return null;

  const handleTaskUpdate = (task: Task, value: any, isComplete: boolean) => {
    if (task.type === ProofType.OTP) setProof(p => ({ ...p, otp: value }));
    if (task.type === ProofType.PHOTO) setProof(p => ({...p, photos: [...(p.photos || []), value]}));
    
    setCompletedTasks(c => ({...c, [task.label]: isComplete}));
  };

  const allRequiredTasksDone = job.pickup.tasks
    .filter(t => t.required)
    .every(t => completedTasks[t.label]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Pickup Checklist</h2>
      <div className="space-y-4">
        <ChecklistItem label={`Confirm item count (${job.pickup.itemCount})`} isCount={true} required={true} onUpdate={(val, complete) => setCompletedTasks(c => ({...c, "itemCount": complete}))} />
        {job.pickup.tasks.map(task => (
          <ChecklistItem key={task.label} label={task.label} type={task.type} required={task.required} onUpdate={(val, complete) => handleTaskUpdate(task, val, complete)} />
        ))}
      </div>
      <Button 
        variant="primary" 
        disabled={!allRequiredTasksDone || !completedTasks["itemCount"]}
        onClick={() => transition('COMPLETE_PICKUP', proof)}
      >
        Complete Pickup
      </Button>
       <Button variant="danger" onClick={() => transition('REPORT_ISSUE')}>
          Report an Issue
        </Button>
    </div>
  );
};

export default AtPickupScreen;