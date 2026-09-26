import { Card } from '@/components/primitives/Card';
import { ProgressBar } from '@/components/primitives/ProgressBar';
import type { DashboardStats, QuizAttempt } from '@/types/domain';

interface AnalyticsViewProps {
  attempts: QuizAttempt[];
  stats: DashboardStats;
}

export const AnalyticsView = ({ attempts, stats }: AnalyticsViewProps) => (
  <section className="grid-layout">
    <Card title="Quiz Performance">
      {attempts.length === 0 ? (
        <p className="muted">No quiz attempts yet.</p>
      ) : (
        <ul>
          {attempts.slice(0, 6).map((attempt) => (
            <li key={attempt.id}>
              {new Date(attempt.completedAt).toLocaleDateString()} · {Math.round((attempt.score / attempt.total) * 100)}%
            </li>
          ))}
        </ul>
      )}
    </Card>

    <Card title="Mastery Radar">
      {stats.masteryBySubject.map((subjectStat) => (
        <ProgressBar key={subjectStat.subject} label={subjectStat.subject} value={subjectStat.mastery} />
      ))}
    </Card>

    <Card title="Streak Momentum">
      <p>
        <strong>{stats.currentStreak} day streak</strong>
      </p>
      <p className="muted">Keep at least one quiz or revision session per day to maintain momentum.</p>
    </Card>
  </section>
);
