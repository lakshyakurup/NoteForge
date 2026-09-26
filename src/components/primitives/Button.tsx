import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => (
  <button
    className={`btn btn-${variant} ${className}`.trim()}
    {...props}
  />
);
