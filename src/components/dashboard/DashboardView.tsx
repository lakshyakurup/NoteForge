import { Card } from '@/components/primitives/Card';
import { ProgressBar } from '@/components/primitives/ProgressBar';
import type { ActivityItem, DashboardStats } from '@/types/domain';
import { formatRelativeDate } from '@/utils/date';

interface DashboardViewProps {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  onJumpTo: (view: 'notes' | 'learn' | 'revision') => void;
}

export const DashboardView = ({ stats, recentActivity, onJumpTo }: DashboardViewProps) => (
  <section className="grid-layout">
    <Card title="Study Snapshot" description="Your learning pulse in one view.">
      <dl className="stat-grid">
        <div>
          <dt>Total Notes</dt>
          <dd>{stats.totalNotes}</dd>
        </div>
        <div>
          <dt>Weekly Quizzes</dt>
          <dd>{stats.weeklyQuizzes}</dd>
        </div>
        <div>
          <dt>Current Streak</dt>
          <dd>{stats.currentStreak} days</dd>
        </div>
        <div>
          <dt>Due Revisions</dt>
          <dd>{stats.dueRevisions}</dd>
        </div>
      </dl>
      <p>
        Average quiz score: <strong>{stats.averageScore}%</strong>
      </p>
    </Card>

    <Card title="Quick Actions">
      <div className="button-row">
        <button type="button" className="quick-action" onClick={() => onJumpTo('notes')}>
          Create or edit notes
        </button>
        <button type="button" className="quick-action" onClick={() => onJumpTo('learn')}>
          Generate a practice quiz
        </button>
        <button type="button" className="quick-action" onClick={() => onJumpTo('revision')}>
          Complete due revision items
        </button>
      </div>
    </Card>

    <Card title="Mastery by Subject">
      {stats.masteryBySubject.length === 0 ? (
        <p className="muted">No quiz data yet. Start with one quiz to build mastery insights.</p>
      ) : (
        stats.masteryBySubject.map((item) => <ProgressBar key={item.subject} label={item.subject} value={item.mastery} />)
      )}
    </Card>

    <Card title="Recent Activity">
      <ul className="activity-list">
        {recentActivity.slice(0, 5).map((activity) => (
          <li key={activity.id}>
            <p>
              <strong>{activity.title}</strong>
            </p>
            <p>{activity.detail}</p>
            <small className="muted">{formatRelativeDate(activity.timestamp)}</small>
          </li>
        ))}
      </ul>
    </Card>
  </section>
);
