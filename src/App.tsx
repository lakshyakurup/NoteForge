import { useMemo, useState } from 'react';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { ConceptExplainer } from '@/components/concepts/ConceptExplainer';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { AppLayout, type AppView } from '@/components/layout/AppLayout';
import { QuizAttemptView } from '@/components/learning/QuizAttemptView';
import { QuizBuilderPanel } from '@/components/learning/QuizBuilderPanel';
import { NoteDetail } from '@/components/notes/NoteDetail';
import { NoteForm } from '@/components/notes/NoteForm';
import { NotesList } from '@/components/notes/NotesList';
import { RevisionQueueView } from '@/components/revision/RevisionQueueView';
import { Card } from '@/components/primitives/Card';
import { AppStateProvider, useAppState } from '@/state/AppStateContext';
import './index.css';

const AppContent = () => {
  const [view, setView] = useState<AppView>('dashboard');

  const {
    notes,
    selectedNoteId,
    selectNote,
    createNote,
    updateNote,
    dashboardStats,
    activities,
    generateQuiz,
    currentQuiz,
    submitQuiz,
    explainConcept,
    revisions,
    completeRevision,
    attempts,
  } = useAppState();

  const selectedNote = useMemo(() => notes.find((note) => note.id === selectedNoteId), [notes, selectedNoteId]);

  return (
    <AppLayout activeView={view} onChangeView={setView}>
      {view === 'dashboard' ? (
        <DashboardView
          stats={dashboardStats}
          recentActivity={activities}
          onJumpTo={(nextView) => setView(nextView)}
        />
      ) : null}

      {view === 'notes' ? (
        <section className="grid-layout notes-layout">
          <NotesList notes={notes} selectedNoteId={selectedNoteId} onSelect={selectNote} />
          <div className="stacked">
            <NoteDetail note={selectedNote} />
            <NoteForm
              activeNote={selectedNote}
              onSubmit={(input) => {
                if (selectedNote) {
                  updateNote(selectedNote.id, input);
                } else {
                  createNote(input);
                }
              }}
            />
          </div>
        </section>
      ) : null}

      {view === 'learn' ? (
        <section className="stacked">
          <QuizBuilderPanel notes={notes} onGenerateQuiz={generateQuiz} />
          {currentQuiz ? <QuizAttemptView quiz={currentQuiz} onSubmit={submitQuiz} /> : <Card title="No quiz yet"><p className="muted">Generate a quiz from any note to begin practice.</p></Card>}
        </section>
      ) : null}

      {view === 'concepts' ? <ConceptExplainer notes={notes} onExplain={explainConcept} /> : null}

      {view === 'revision' ? (
        <RevisionQueueView notes={notes} revisions={revisions} onComplete={completeRevision} />
      ) : null}

      {view === 'analytics' ? <AnalyticsView attempts={attempts} stats={dashboardStats} /> : null}
    </AppLayout>
  );
};

const App = () => (
  <AppStateProvider>
    <AppContent />
  </AppStateProvider>
);

export default App;
