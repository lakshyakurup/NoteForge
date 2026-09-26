import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const Card = ({ title, description, children }: CardProps) => (
  <section className="card" aria-label={title}>
    {title ? <h3>{title}</h3> : null}
    {description ? <p className="muted">{description}</p> : null}
    {children}
  </section>
);
