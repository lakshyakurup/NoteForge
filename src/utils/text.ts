export const countWords = (content: string): number => {
  const trimmed = content.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
};

export const extractConcepts = (content: string): string[] => {
  const tokens = content
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 5);

  const uniqueTokens = Array.from(new Set(tokens));
  return uniqueTokens.slice(0, 8).map((token) => token.replace(/(^\w)/, (match) => match.toUpperCase()));
};

export const normalizeTags = (tagsInput: string): string[] =>
  tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
