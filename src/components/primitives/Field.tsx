import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

interface FieldProps {
  id: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
}

export const Field = ({ id, label, error, children }: FieldProps) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    {children}
    {error ? <span role="alert" className="error-text">{error}</span> : null}
  </div>
);

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => <input className="input" {...props} />;

export const TextArea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className="input" rows={6} {...props} />;
