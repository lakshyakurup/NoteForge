import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BrainCircuit,
  Check,
  FileText,
  Layers3,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

const outputs = [
  { icon: BrainCircuit, label: "Interactive quiz", detail: "Recall it, don’t just reread it", number: "01" },
  { icon: BookOpenCheck, label: "Clear explanations", detail: "Make tricky ideas click", number: "02" },
  { icon: Layers3, label: "Revision pack", detail: "Flashcards and key takeaways", number: "03" },
];

function Brand() {
  return (
    <Link href="/" className="nf-brand" aria-label="NoteForge home">
      <span className="nf-brand-mark"><BrainCircuit size={18} aria-hidden="true" /></span>
      <span>NoteForge<span className="nf-brand-period">.</span></span>
    </Link>
  );
}

function SiteNav() {
  return (
    <header className="nf-header">
      <div className="nf-nav">
        <Brand />
        <nav className="nf-nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#study-tools">Study tools</a>
        </nav>
        <Link className="nf-nav-cta" href="/app">Open NoteForge <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </header>
  );
}

function StudyPreview() {
  return (
    <div className="nf-preview" aria-label="Example NoteForge study workspace">
      <div className="nf-preview-topbar">
        <div className="nf-window-dots" aria-hidden="true"><i /><i /><i /></div>
        <span>NOTEFORGE / STUDY SESSION</span>
        <span className="nf-session-status"><span /> SESSION SAVED</span>
      </div>
      <div className="nf-preview-body">
        <aside className="nf-preview-sidebar" aria-label="Study modes">
          <div className="nf-sidebar-logo"><BrainCircuit size={18} /></div>
          <span className="nf-sidebar-item selected"><FileText size={16} /><span>Forge</span></span>
          <span className="nf-sidebar-item"><Layers3 size={16} /><span>Study</span></span>
          <div className="nf-sidebar-bottom"><span>NK</span></div>
        </aside>
        <div className="nf-preview-workspace">
          <div className="nf-preview-heading"><div><span className="nf-preview-kicker">YOUR STUDY SPACE</span><h2>Cellular respiration</h2></div><span className="nf-source-chip"><FileText size={12} /> Biology notes.pdf</span></div>
          <div className="nf-note-source"><span className="nf-note-label"><span /> SOURCE NOTES</span><p>Cellular respiration converts glucose into ATP. Glycolysis happens in the cytoplasm; the Krebs cycle and electron transport chain occur in the mitochondria...</p><span className="nf-note-count">1,248 WORDS · 6 PAGES</span></div>
          <div className="nf-output-tabs" aria-label="Generated study materials"><span className="active"><BrainCircuit size={13} /> Quiz</span><span><BookOpenCheck size={13} /> Concepts</span><span><Layers3 size={13} /> Revision</span></div>
          <div className="nf-question-card"><div className="nf-question-meta"><span>QUESTION 2 OF 8</span><span className="nf-question-progress"><i /></span></div><p>Where does the electron transport chain take place?</p><div className="nf-answer selected"><span>A</span> Inner mitochondrial membrane <Check size={14} /></div><div className="nf-answer"><span>B</span> Cytoplasm</div><div className="nf-answer"><span>C</span> Nuclear membrane</div></div>
          <div className="nf-preview-foot"><span><Sparkles size={13} /> Built from your notes</span><span>02 / 08</span></div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="nf-hero" id="top" aria-labelledby="nf-title">
      <div className="nf-aurora" aria-hidden="true"><span /><span /><span /></div>
      <div className="nf-hero-copy">
        <p className="nf-eyebrow"><span className="nf-eyebrow-icon"><Sparkles size={13} /></span> Your notes, ready to teach you back</p>
        <h1 id="nf-title">Turn your notes into<br /><span>a study superpower.</span></h1>
        <p className="nf-hero-description">Go from lecture notes to real understanding. NoteForge makes interactive quizzes, clear concept explanations, and revision materials built around what you need to learn.</p>
        <div className="nf-hero-actions"><Link className="nf-button-primary" href="/app">Start learning <ArrowUpRight size={17} aria-hidden="true" /></Link><a className="nf-button-secondary" href="#how-it-works">See how it works <ArrowDownRight size={16} aria-hidden="true" /></a></div>
        <p className="nf-hero-note"><Upload size={14} aria-hidden="true" /> Paste notes or upload a PDF, Markdown, or text file</p>
      </div>
      <StudyPreview />
      <div className="nf-hero-foot"><span>LESS REREADING. MORE REMEMBERING.</span><span>MADE FOR THE WAY YOU LEARN <ArrowRight size={13} /></span></div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: "01", title: "Bring your notes", description: "Paste a class, drop in a PDF, or pick up where your last study session left off.", icon: FileText },
    { number: "02", title: "Choose your study mode", description: "Get quizzed, untangle a concept, or build a focused revision pack in one click.", icon: Zap },
    { number: "03", title: "Learn it for real", description: "Practice with interactive questions and flashcards made from your own material.", icon: BrainCircuit },
  ];
  return (
    <section className="nf-steps-section" id="how-it-works" aria-labelledby="nf-steps-title">
      <div className="nf-section-heading"><p className="nf-section-label">FROM NOTES TO KNOW-HOW</p><h2 id="nf-steps-title">Your study session,<br /><span>with a better starting point.</span></h2></div>
      <div className="nf-steps-grid">{steps.map(({ number, title, description, icon: Icon }) => <article className="nf-step" key={number}><div className="nf-step-top"><span>{number}</span><Icon size={19} aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></article>)}</div>
    </section>
  );
}

function StudyTools() {
  return (
    <section className="nf-tools-section" id="study-tools" aria-labelledby="nf-tools-title">
      <div className="nf-tools-intro"><p className="nf-section-label">ONE SET OF NOTES. MORE WAYS TO LEARN.</p><h2 id="nf-tools-title">Study the way<br />your brain <span>actually works.</span></h2><p>Switch from understanding to recall to review without starting over or losing your place.</p><Link className="nf-inline-link" href="/app">Explore your study space <ArrowRight size={15} /></Link></div>
      <div className="nf-tools-list">{outputs.map(({ icon: Icon, label, detail, number }) => <article className="nf-tool-row" key={number}><span className="nf-tool-number">{number}</span><span className="nf-tool-icon"><Icon size={18} aria-hidden="true" /></span><div><h3>{label}</h3><p>{detail}</p></div><ArrowUpRight className="nf-tool-arrow" size={17} aria-hidden="true" /></article>)}</div>
    </section>
  );
}

function ClosingCta() {
  return <section className="nf-closing"><div><p className="nf-section-label">THE NEXT STUDY SESSION CAN FEEL DIFFERENT</p><h2>Make your notes<br />work <span>harder for you.</span></h2></div><Link className="nf-button-primary" href="/app">Open your study space <ArrowUpRight size={17} aria-hidden="true" /></Link></section>;
}

export function NoteForgeLanding() {
  return <main className="noteforge-landing"><SiteNav /><Hero /><HowItWorks /><StudyTools /><ClosingCta /><footer className="nf-footer"><Brand /><span>Turn what you have into what you know.</span><Link href="/app">Open the app <ArrowUpRight size={14} /></Link></footer></main>;
}
