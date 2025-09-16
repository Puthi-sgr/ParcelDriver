import React, { useState, useRef, useEffect } from 'react';
import { ProofType } from '../../types';
import Button from './Button';

interface ChecklistItemProps {
  label: string;
  type?: ProofType;
  required?: boolean;
  isCount?: boolean;
  onUpdate: (value: any, isComplete: boolean) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ label, type, required = false, isCount = false, onUpdate }) => {
  const [isComplete, setIsComplete] = useState(false);

  const renderInput = () => {
    switch(type) {
      case ProofType.OTP:
        return <ChecklistItemInput onComplete={(val) => { onUpdate(val, true); setIsComplete(true); }} />;
      case ProofType.PHOTO:
        return <ChecklistItemPhoto onComplete={(val) => { onUpdate(val, true); setIsComplete(true); }} />;
      case ProofType.SIGNATURE:
        return <ChecklistItemSignature onComplete={(val) => { onUpdate(val, true); setIsComplete(true); }} />;
      default:
        if (isCount) {
             return <ChecklistItemSimple onComplete={(val) => { onUpdate(val, true); setIsComplete(true); }} />;
        }
        return null;
    }
  };

  return (
    <div className={`bg-[var(--color-surface)] p-4 rounded-xl transition-colors ${isComplete ? 'border-l-4 border-[var(--color-success)]' : 'border-l-4 border-[var(--color-border)]'}`}>
      <div className="flex justify-between items-center">
        <div>
            <p className="font-semibold">{label}</p>
            {required && !isComplete && <p className="text-xs text-[var(--color-danger)]">Required</p>}
        </div>
        {isComplete ? (
          <div className="text-[var(--color-success)] font-bold">✓ Done</div>
        ) : (
          renderInput()
        )}
      </div>
    </div>
  );
};

// Sub-components for different proof types

const ChecklistItemSimple: React.FC<{onComplete: (val: boolean) => void}> = ({ onComplete }) => {
    return (
      <button 
        onClick={() => onComplete(true)} 
        className="bg-[var(--color-primary)] text-white text-sm font-bold py-2 px-4 rounded-xl hover:opacity-90 transition-opacity"
      >
        Confirm
      </button>
    );
}

const ChecklistItemInput: React.FC<{onComplete: (val: string) => void}> = ({ onComplete }) => {
  const [value, setValue] = useState('');
  return (
    <div className="flex gap-2 items-center">
        <input 
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            className="bg-[var(--color-background)] text-[var(--color-text-primary)] rounded-lg p-2 w-24 text-center border border-[var(--color-border)]"
            placeholder="Enter code"
        />
        <button 
          onClick={() => onComplete(value)} 
          disabled={!value} 
          className="bg-[var(--color-primary)] text-white text-sm font-bold py-2 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
    </div>
  );
};

const ChecklistItemPhoto: React.FC<{onComplete: (data: string) => void}> = ({ onComplete }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      onComplete(dataUrl);
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
    return <img src={photo} alt="Proof" className="w-16 h-16 rounded-xl object-cover" />;
  }
  
  if (videoRef.current?.srcObject) {
      return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
              <video ref={videoRef} autoPlay className="w-full h-auto max-h-[80%] rounded-xl mb-4" />
              <div className="w-full max-w-xs">
                <Button onClick={takePicture}>Take Picture</Button>
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
      );
  }

  return <Button onClick={startCamera} className="py-2 px-4 text-sm">Take Photo</Button>;
};

const ChecklistItemSignature: React.FC<{onComplete: (data: string) => void}> = ({ onComplete }) => {
    const [isSigning, setIsSigning] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);

    useEffect(() => {
        if (isSigning && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.strokeStyle = "#1c1c1e"; // Matches --color-text-primary
                ctx.lineWidth = 2;
            }
        }
    }, [isSigning]);
    
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        isDrawing.current = true;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
    };
    
    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        isDrawing.current = false;
    };
    
    const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        if ('touches' in e.nativeEvent) {
            return {
                x: e.nativeEvent.touches[0].clientX - rect.left,
                y: e.nativeEvent.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
        };
    }

    const saveSignature = () => {
        const dataUrl = canvasRef.current?.toDataURL('image/png') || '';
        onComplete(dataUrl);
        setIsSigning(false);
    };

    if (isSigning) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
                <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow-xl">
                    <p className="mb-2 text-center">Sign below</p>
                    <canvas 
                        ref={canvasRef}
                        width={300}
                        height={150}
                        className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                    <div className="flex gap-4 mt-4">
                        <Button variant="secondary" onClick={() => setIsSigning(false)}>Cancel</Button>
                        <Button onClick={saveSignature}>Save</Button>
                    </div>
                </div>
            </div>
        )
    }

    return <Button onClick={() => setIsSigning(true)} className="py-2 px-4 text-sm">Get Signature</Button>;
}

export default ChecklistItem;