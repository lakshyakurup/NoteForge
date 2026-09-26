export const EmptyState = ({ title, detail }: { title: string; detail: string }) => (
  <div className="state-block" role="status">
    <h3>{title}</h3>
    <p className="muted">{detail}</p>
  </div>
);

export const LoadingState = ({ label }: { label: string }) => (
  <p className="state-block" role="status" aria-live="polite">
    {label}
  </p>
);

export const ErrorState = ({ message }: { message: string }) => (
  <p className="state-block error" role="alert">
    {message}
  </p>
);
