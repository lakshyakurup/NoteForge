import { Button } from '@/components/primitives/Button';
import type { ReactNode } from 'react';

export type AppView = 'dashboard' | 'notes' | 'learn' | 'concepts' | 'revision' | 'analytics';

const NAV_ITEMS: Array<{ key: AppView; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'notes', label: 'Notes' },
  { key: 'learn', label: 'Learning' },
  { key: 'concepts', label: 'Concepts' },
  { key: 'revision', label: 'Revision' },
  { key: 'analytics', label: 'Analytics' },
];

interface AppLayoutProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  children: ReactNode;
}

export const AppLayout = ({ activeView, onChangeView, children }: AppLayoutProps) => (
  <div className="app-shell">
    <header className="header">
      <div>
        <h1>NoteForge</h1>
        <p className="muted">AI-powered study companion for quizzes, concept clarity, and revision plans.</p>
      </div>
      <nav aria-label="Main navigation" className="nav-grid">
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.key}
            variant={item.key === activeView ? 'primary' : 'secondary'}
            onClick={() => onChangeView(item.key)}
            aria-current={item.key === activeView ? 'page' : undefined}
          >
            {item.label}
          </Button>
        ))}
      </nav>
    </header>
    <main>{children}</main>
  </div>
);
