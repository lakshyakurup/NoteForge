interface ProgressBarProps {
  value: number;
  label: string;
}

export const ProgressBar = ({ value, label }: ProgressBarProps) => (
  <div className="progress-wrap">
    <div className="progress-label-row">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="progress-bg" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  </div>
);
