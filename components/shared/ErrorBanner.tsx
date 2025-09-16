import React from 'react';

interface ErrorBannerProps {
  message: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-[var(--color-danger)] text-white p-3 text-center text-sm font-semibold">
      <p>{message}</p>
    </div>
  );
};

export default ErrorBanner;