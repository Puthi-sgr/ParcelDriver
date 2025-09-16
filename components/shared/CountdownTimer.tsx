import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiryTimestamp: number;
  totalDuration: number;
  onComplete: () => void;
  size?: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryTimestamp, totalDuration, onComplete, size = 80 }) => {
  const [timeLeft, setTimeLeft] = useState(Math.round((expiryTimestamp - Date.now()) / 1000));

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete]);

  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = timeLeft / totalDuration;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-[var(--color-border)]"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-[var(--color-success)] transition-all duration-1000 linear"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      <span className="text-2xl font-bold text-[var(--color-text-primary)]">{timeLeft > 0 ? timeLeft : 0}</span>
    </div>
  );
};

export default CountdownTimer;