import React from 'react';

interface MapProps {
  isSearching?: boolean;
  showLoadingRing?: boolean;
  showRouteAnimation?: boolean;
}

const Map: React.FC<MapProps> = ({ isSearching = false, showLoadingRing = false, showRouteAnimation = false }) => {
  return (
    <div className="relative w-64 h-64 md:w-72 md:h-72 my-4 flex items-center justify-center overflow-hidden">
      {/* Base Map SVG */}
      <svg
        viewBox="0 0 200 200"
        className="absolute w-full h-full text-[var(--color-border)]"
        xmlns="http://www.w.w3.org/2000/svg"
      >
        {/* Simplified grid lines */}
        <path d="M 50 0 L 50 200" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 100 0 L 100 200" stroke="currentColor" strokeWidth="1" />
        <path d="M 150 0 L 150 200" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 0 50 L 200 50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 0 100 L 200 100" stroke="currentColor" strokeWidth="1" />
        <path d="M 0 150 L 200 150" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Route Animation */}
        {showRouteAnimation && (
          <g>
            {/* Pickup pin */}
            <circle cx="170" cy="40" r="8" fill="var(--color-accent)" />
            <circle cx="170" cy="40" r="4" fill="white" />
            {/* Animated route line */}
            <path
                d="M 100 100 Q 150 100 170 40"
                stroke="var(--color-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                className="animate-draw-line"
            />
            {/* Labels */}
            <text x="100" y="118" textAnchor="middle" fontSize="8px" fontWeight="bold" fill="var(--color-text-secondary)">You</text>
            <text x="170" y="30" textAnchor="middle" fontSize="8px" fontWeight="bold" fill="var(--color-text-secondary)">Pick up</text>
          </g>
        )}
      </svg>
      
      {/* Center Pin */}
      <div className={`w-4 h-4 rounded-full bg-[var(--color-primary)] z-10 ${isSearching ? 'animate-pulse' : ''}`}></div>
      
      {/* Searching Animation */}
      {isSearching && (
        <>
          <div className="absolute w-full h-full rounded-full border-2 border-[var(--color-primary)]/50 animate-ping-slow"></div>
          <div className="absolute w-2/3 h-2/3 rounded-full border-2 border-[var(--color-primary)]/30 animate-ping-slower"></div>
        </>
      )}

      {/* Loading Ring */}
      {showLoadingRing && (
          <div className="absolute w-12 h-12 rounded-full border-t-2 border-b-2 border-[var(--color-primary)] animate-spin"></div>
      )}
    </div>
  );
};

export default Map;