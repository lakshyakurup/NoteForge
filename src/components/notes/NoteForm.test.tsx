import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NoteForm } from './NoteForm';

describe('NoteForm', () => {
  it('shows validation messages for invalid submit', () => {
    const onSubmit = vi.fn();
    render(<NoteForm activeNote={undefined} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /create note/i }));

    expect(screen.getByText(/title must be at least/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form values', () => {
    const onSubmit = vi.fn();
    render(<NoteForm activeNote={undefined} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Linear Algebra Basics' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Math' } });
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'matrices, vectors' } });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'Linear algebra focuses on vectors, matrices, and transformations with practical applications.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create note/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
