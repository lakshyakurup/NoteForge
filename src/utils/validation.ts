import type { NoteInput } from '@/types/domain';

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof NoteInput, string>>;
}

export const validateNoteInput = (input: NoteInput): ValidationResult => {
  const errors: ValidationResult['errors'] = {};

  if (input.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  }

  if (input.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  }

  if (input.content.trim().length < 40) {
    errors.content = 'Content must be at least 40 characters.';
  }

  if (input.tags.split(',').filter((tag) => tag.trim()).length === 0) {
    errors.tags = 'Add at least one tag.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
