import React, { useState } from 'react';
import Button from '../shared/Button';
import { AppContext } from '../../types';

interface ExceptionScreenProps {
    context: AppContext;
    transition: (event: string, payload?: any) => void;
}

const issueReasons = [
    "Customer not available",
    "Incorrect address",
    "Item damaged",
    "Unable to access location",
    "Other"
];

const ExceptionScreen: React.FC<ExceptionScreenProps> = ({ context, transition }) => {
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState<string | null>(null);

  const handlePhotoTaken = (dataUrl: string) => {
    setEvidence(dataUrl);
  };
  
  const handleSubmit = () => {
    transition('REPORT_ISSUE', { reason, evidence });
  };

  if(context.issue) {
    return (
         <div className="p-4 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-4">Issue Reported</h2>
            <p className="text-[var(--color-text-secondary)] mb-2">Reason: <span className="font-semibold text-[var(--color-text-primary)]">{context.issue.reason}</span></p>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-xl my-4 w-full">
                <p className="font-bold text-lg">Next Step:</p>
                <p>{context.issue.resolution}</p>
            </div>
            <Button variant="primary" onClick={() => transition('RESOLVE_ISSUE')}>
                Acknowledge & Continue
            </Button>
        </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Report an Issue</h2>
      
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Reason for issue:</label>
        <select 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2.5"
        >
          <option value="">Select a reason...</option>
          {issueReasons.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Photo Evidence (Optional):</label>
          <ChecklistItemPhoto onPhotoTaken={handlePhotoTaken} />
      </div>

      <Button variant="danger" disabled={!reason} onClick={handleSubmit}>
        Submit Report
      </Button>
    </div>
  );
};


// Helper component for photo capture
const ChecklistItemPhoto: React.FC<{onPhotoTaken: (data: string) => void}> = ({ onPhotoTaken }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check permissions.");
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/png');
      setPhoto(dataUrl);
      onPhotoTaken(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  if (photo) {
    return (
      <div className="flex items-center space-x-4">
        <img src={photo} alt="Evidence" className="w-20 h-20 rounded-xl object-cover" />
        <p className="text-[var(--color-success)]">Photo captured.</p>
        <button onClick={() => setPhoto(null)} className="text-sm text-[var(--color-danger)]">Retake</button>
      </div>
    );
  }

  if (videoRef.current?.srcObject) {
    return (
        <div>
            <video ref={videoRef} autoPlay className="w-full rounded-xl mb-2" />
            <Button onClick={takePicture}>Take Picture</Button>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
  }

  return <Button variant="secondary" onClick={startCamera}>Take Photo</Button>;
}

export default ExceptionScreen;