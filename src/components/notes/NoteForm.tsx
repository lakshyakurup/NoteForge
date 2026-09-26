import { useEffect, useState } from 'react';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { Field, Input, TextArea } from '@/components/primitives/Field';
import type { Note, NoteInput } from '@/types/domain';
import { validateNoteInput } from '@/utils/validation';

const emptyForm: NoteInput = {
  title: '',
  subject: '',
  difficulty: 'beginner',
  tags: '',
  content: '',
};

interface NoteFormProps {
  activeNote: Note | undefined;
  onSubmit: (input: NoteInput) => void;
}

export const NoteForm = ({ activeNote, onSubmit }: NoteFormProps) => {
  const [form, setForm] = useState<NoteInput>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof NoteInput, string>>>({});

  useEffect(() => {
    if (!activeNote) {
      setForm(emptyForm);
      return;
    }

    setForm({
      title: activeNote.title,
      subject: activeNote.subject,
      difficulty: activeNote.difficulty,
      tags: activeNote.tags.join(', '),
      content: activeNote.content,
    });
  }, [activeNote]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateNoteInput(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(form);
    if (!activeNote) {
      setForm(emptyForm);
    }
  };

  return (
    <Card title={activeNote ? 'Edit Note' : 'Create New Note'}>
      <form onSubmit={handleSubmit} className="form-grid">
        <Field id="title" label="Title" error={errors.title}>
          <Input
            id="title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
        </Field>

        <Field id="subject" label="Subject" error={errors.subject}>
          <Input
            id="subject"
            value={form.subject}
            onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
          />
        </Field>

        <Field id="difficulty" label="Difficulty">
          <select
            id="difficulty"
            className="input"
            value={form.difficulty}
            onChange={(event) => setForm((prev) => ({ ...prev, difficulty: event.target.value as NoteInput['difficulty'] }))}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </Field>

        <Field id="tags" label="Tags (comma separated)" error={errors.tags}>
          <Input
            id="tags"
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
          />
        </Field>

        <Field id="content" label="Content" error={errors.content}>
          <TextArea
            id="content"
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
          />
        </Field>

        <Button type="submit">{activeNote ? 'Save Changes' : 'Create Note'}</Button>
      </form>
    </Card>
  );
};
