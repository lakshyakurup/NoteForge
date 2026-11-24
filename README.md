# NoteForge

An AI-powered learning tool that transforms raw study notes into interactive quizzes, in-depth concept explanations, and personalized revision content.

---

## ✨ Key Features

- **Interactive Quiz Generation**: Multiple-choice, fill-in-the-blank, and short-answer questions with **live answering + scoring**.
- **Deep Concept Breakdown**: Structured explanations with key points and analogies.
- **Personalized Revision Packs**: Cheat sheets, **flip-style flashcards**, and high-yield points.
- **Multi-Format Input**: Paste text **or upload** `.txt`, `.md`, or **PDF** files.
- **Dark / Light theme** toggle.
- **Local Auth + History**: Simple browser profile and saved generation history (localStorage).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (React 19), TypeScript, Tailwind CSS, next-themes
- **AI**: Google Gemini API / OpenAI API (switchable)
- **PDF**: pdfjs-dist (client-side text extraction)
- **UI**: Lucide Icons, custom Shadcn-style components

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm / pnpm / yarn
- Gemini **or** OpenAI API key

### Installation

```bash
git clone https://github.com/lakshyakurup/NoteForge.git
cd NoteForge
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
GEMINI_API_KEY=your_key_here
# or
OPENAI_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # Button, Card, Textarea
│   ├── auth-dialog.tsx
│   ├── file-upload.tsx
│   ├── flashcard.tsx
│   ├── history-panel.tsx
│   ├── quiz-player.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
└── lib/
    ├── ai.ts
    ├── history.ts           # localStorage auth + history
    └── utils.ts
```

---

## 🔑 API Keys

| Provider | Get Key |
|----------|---------|
| Google Gemini | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| OpenAI | [platform.openai.com](https://platform.openai.com/api-keys) |

Set `AI_PROVIDER=gemini` or `openai` to force a provider.

---

## 📄 License

MIT © 2026 Lakshya Kurup
