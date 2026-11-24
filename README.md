# NoteForge

An AI-powered learning tool that transforms raw study notes into interactive quizzes, in-depth concept explanations, and personalized revision content.

---

## ✨ Key Features

- **Interactive Quiz Generation**: Automatically extracts key concepts from notes to generate multiple-choice, fill-in-the-blank, and short-answer quizzes.
- **Deep Concept Breakdown**: Simplifies complex topics and terminology into digestible, structured explanations.
- **Personalized Revision Summaries**: Generates quick-read cheat sheets, flashcards, and high-yield review content tailored to your study materials.
- **Multi-Format Input**: Process notes from plain text, Markdown, or uploaded document files.

---

## 🛠️ Tech Stack

- **Frontend / Framework**: Next.js 15 (React 19), TypeScript, Tailwind CSS
- **AI Integration**: Google Gemini API / OpenAI API (switchable)
- **State & UI**: Lucide Icons, custom Shadcn-style components

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18.x or higher)
- npm, pnpm, or yarn
- An API Key (Gemini **or** OpenAI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lakshyakurup/NoteForge.git
   cd NoteForge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add at least one API key:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   # or
   OPENAI_API_KEY=your_openai_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
NoteForge/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts   # AI generation endpoint
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Main UI
│   ├── components/ui/              # Button, Card, Textarea
│   └── lib/
│       ├── ai.ts                   # Gemini + OpenAI wrappers
│       └── utils.ts
├── .env.example
├── package.json
└── tailwind.config.ts
```

---

## 🔑 API Keys

| Provider | Get Key |
|----------|---------|
| Google Gemini | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| OpenAI | [platform.openai.com](https://platform.openai.com/api-keys) |

Set `AI_PROVIDER=gemini` or `AI_PROVIDER=openai` in `.env.local` to force a provider.

---

## 📄 License

MIT © 2026 Lakshya Kurup
