import React, { useState } from 'react';
import { AppContext, Proof, Task, DeliveryType, ProofType } from '../../types';
import Button from '../shared/Button';
import ChecklistItem from '../shared/ChecklistItem';

interface AtDropoffScreenProps {
  context: AppContext;
  // FIX: Made payload optional to fix error on transition calls without a payload.
  transition: (event: string, payload?: any) => void;
}

const AtDropoffScreen: React.FC<AtDropoffScreenProps> = ({ context, transition }) => {
  const { job } = context;
  const [proof, setProof] = useState<Proof>({ photos: [] });
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  if (!job) return null;

  const handleTaskUpdate = (task: Task, value: any, isComplete: boolean) => {
    if (task.type === ProofType.OTP) setProof(p => ({ ...p, otp: value }));
    if (task.type === ProofType.SIGNATURE) setProof(p => ({ ...p, signature: value }));
    if (task.type === ProofType.PHOTO) setProof(p => ({...p, photos: [...(p.photos || []), value]}));
    
    setCompletedTasks(c => ({...c, [task.label]: isComplete}));
  };
  
  const allTasks = job.dropoff.tasks;
  const deliveryTypeInstruction = job.dropoff.deliveryType === DeliveryType.LEAVE_AT_DOOR 
    ? "Leave at a safe place" 
    : "Hand over to customer";

  const allRequiredTasksDone = allTasks
    .filter(t => t.required)
    .every(t => completedTasks[t.label]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Dropoff Checklist</h2>
      <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 p-4 rounded-xl">
        <p className="font-bold text-lg text-[var(--color-primary)]">{deliveryTypeInstruction}</p>
        <p className="text-[var(--color-primary)] opacity-90">{job.dropoff.notes}</p>
      </div>
      <div className="space-y-4">
        {allTasks.map(task => (
          <ChecklistItem key={task.label} label={task.label} type={task.type} required={task.required} onUpdate={(val, complete) => handleTaskUpdate(task, val, complete)} />
        ))}
      </div>
      <div className="space-y-4">
        <Button 
            variant="primary" 
            disabled={!allRequiredTasksDone}
            onClick={() => transition('COMPLETE_DELIVERY', proof)}
        >
            Complete Delivery
        </Button>
        <Button variant="danger" onClick={() => transition('REPORT_ISSUE')}>
          Report an Issue
        </Button>
      </div>
    </div>
  );
};

export default AtDropoffScreen;