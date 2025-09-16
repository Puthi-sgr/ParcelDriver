import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "w-full font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
  
  const variantClasses = {
    primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 focus:ring-[var(--color-primary)]',
    secondary: 'bg-slate-100 text-[var(--color-text-primary)] hover:bg-slate-200 focus:ring-[var(--color-secondary)]',
    danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 focus:ring-[var(--color-danger)]',
    success: 'bg-[var(--color-success)] text-white hover:opacity-90 focus:ring-[var(--color-success)]'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;