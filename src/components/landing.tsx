import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Code2,
  Globe2,
  Landmark,
  Leaf,
  Lightbulb,
  Menu,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { WaitlistForm } from "@/components/waitlist-form";

const tracks = [
  {
    number: "01",
    icon: Leaf,
    title: "Climate resilience",
    description: "Make adaptation practical, local, and accessible to more people.",
    tag: "PLANET",
  },
  {
    number: "02",
    icon: BookOpenCheck,
    title: "Learning without limits",
    description: "Build tools that open up knowledge, skills, and opportunity.",
    tag: "PEOPLE",
  },
  {
    number: "03",
    icon: Landmark,
    title: "Civic life, reimagined",
    description: "Make essential public services easier to reach and understand.",
    tag: "SYSTEMS",
  },
  {
    number: "04",
    icon: Code2,
    title: "Your world, your brief",
    description: "Bring a problem you care about. The best starting point is yours.",
    tag: "OPEN TRACK",
  },
];

const moments = [
  {
    number: "01",
    title: "Find your signal",
    description: "Choose a challenge that matters to you, then bring your perspective to the room.",
  },
  {
    number: "02",
    title: "Build across borders",
    description: "Meet collaborators, test ideas, and turn a rough sketch into something people can try.",
  },
  {
    number: "03",
    title: "Show the world",
    description: "Share what you made, what you learned, and what should happen next.",
  },
];

const faqs = [
  {
    question: "When is the hackathon?",
    answer:
      "The dates are being finalized. Join the interest list and we’ll send the announcement as soon as it’s ready.",
  },
  {
    question: "Who can take part?",
    answer:
      "Anyone curious about building a better future is welcome to raise their hand. Participation details and eligibility will be shared with the official announcement.",
  },
  {
    question: "Do I need a team or an idea already?",
    answer:
      "Not yet. You can register your interest as an individual or with a team. We’ll share the team format and challenge details before applications open.",
  },
  {
    question: "Where will it happen?",
    answer:
      "We’re designing this for an international community. The event format and any in-person locations will be confirmed with the dates.",
  },
  {
    question: "Is joining the interest list an application?",
    answer:
      "No. It’s the best way to hear about the event first. We’ll share the official application process when it’s announced.",
  },
];

function Wordmark() {
  return (
    <a className="wordmark" href="#top" aria-label="Horizon Hackathon home">
      <span className="wordmark-mark" aria-hidden="true">
        <Globe2 size={20} strokeWidth={1.8} />
      </span>
      <span>HORIZON<span className="wordmark-period">.</span></span>
    </a>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Wordmark />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#tracks">The challenges</a>
          <a href="#format">How it works</a>
          <a href="#faq">Questions</a>
        </nav>
        <a className="header-cta" href="#join">
          Get the first update <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <details className="mobile-nav">
          <summary aria-label="Open navigation menu">
            <Menu size={21} aria-hidden="true" />
          </summary>
          <nav className="mobile-nav-panel" aria-label="Mobile navigation">
            <a href="#tracks">The challenges</a>
            <a href="#format">How it works</a>
            <a href="#faq">Questions</a>
            <a href="#join">Get the first update <ArrowUpRight size={15} aria-hidden="true" /></a>
          </nav>
        </details>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-aurora" aria-hidden="true"><span /><span /><span /></div>
      <div className="hero-copy">
        <p className="eyebrow"><span className="live-dot" aria-hidden="true" /> A global build starts here</p>
        <h1 id="hero-title">MAKE WHAT&apos;S<br /><span className="hero-highlight">NEXT.</span></h1>
        <p className="hero-lede">
          One planet. A million perspectives. A new international hackathon for people who want to make useful things for the world we share.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#join">Get on the list <ArrowUpRight size={17} aria-hidden="true" /></a>
          <a className="text-link" href="#tracks">Explore the challenges <ArrowDown size={15} aria-hidden="true" /></a>
        </div>
        <div className="hero-footnote">
          <span><Globe2 size={15} aria-hidden="true" /> Wherever you&apos;re building from</span>
          <span className="hero-footnote-separator" aria-hidden="true">/</span>
          <span>Dates announced soon</span>
        </div>
      </div>
      <div className="hero-artwork command-preview" aria-label="Preview of the Horizon hackathon challenge launcher">
        <div className="artwork-index"><span>HZN / 001</span><span>GLOBAL EDITION</span></div>
        <div className="command-search"><SearchGlyph /><span>Find your challenge</span><kbd>⌘ K</kbd></div>
        <div className="command-results">
          <a className="command-result active" href="#tracks"><span className="command-icon"><Leaf size={16} /></span><span><strong>Climate resilience</strong><small>Design for a changing planet</small></span><kbd>↵</kbd></a>
          <a className="command-result" href="#tracks"><span className="command-icon"><BookOpenCheck size={16} /></span><span><strong>Learning without limits</strong><small>Open knowledge to everyone</small></span><kbd>⌘ 2</kbd></a>
          <a className="command-result" href="#tracks"><span className="command-icon"><Landmark size={16} /></span><span><strong>Civic life, reimagined</strong><small>Make public services work better</small></span><kbd>⌘ 3</kbd></a>
          <a className="command-result" href="#tracks"><span className="command-icon"><Lightbulb size={16} /></span><span><strong>Your world, your brief</strong><small>Bring the question you care about</small></span><kbd>⌘ 4</kbd></a>
        </div>
        <div className="command-footer"><span>↑↓ explore <i>·</i> enter choose</span><span><Globe2 size={13} /> HORIZON</span></div>
      </div>
      <div className="hero-bottomline">
        <span>THE FUTURE IS A TEAM SPORT</span>
        <span className="scroll-cue">SCROLL TO EXPLORE <ArrowDown size={13} aria-hidden="true" /></span>
      </div>
    </section>
  );
}

function SearchGlyph() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></svg>;
}

function SignalStrip() {
  const phrases = ["Big ideas travel", "Build beyond borders", "Make the useful thing", "The next move is yours"];
  return (
    <div className="signal-strip" aria-label="Big ideas travel. Build beyond borders. Make the useful thing. The next move is yours.">
      <div className="signal-track" aria-hidden="true">
        {[...phrases, ...phrases].map((phrase, index) => (
          <span className="signal-item" key={`${phrase}-${index}`}>
            {phrase}<span className="signal-star">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function IntroSection() {
  return (
    <section className="intro-section section-wrap" aria-labelledby="intro-title">
      <div className="section-kicker"><span>01</span><span>WHY HORIZON</span></div>
      <div className="intro-content">
        <p className="intro-overline">The problems are global.<br />The people solving them should be, too.</p>
        <h2 id="intro-title">Different places.<br /><span>Shared future.</span></h2>
        <div className="intro-bottom">
          <p>Horizon brings curious builders together to take on real-world challenges with fresh eyes, open minds, and technology that serves people.</p>
          <div className="intro-stamp" aria-label="Open to the world"><Globe2 size={25} aria-hidden="true" /><span>OPEN<br />TO THE<br />WORLD</span></div>
        </div>
      </div>
    </section>
  );
}

function TracksSection() {
  return (
    <section className="tracks-section section-wrap" id="tracks" aria-labelledby="tracks-title">
      <div className="section-topline">
        <div className="section-kicker"><span>02</span><span>CHOOSE YOUR FRONTIER</span></div>
        <span className="section-aside">START WITH WHAT MATTERS TO YOU</span>
      </div>
      <div className="tracks-heading">
        <h2 id="tracks-title">A better world<br />is a <span>buildable</span> idea.</h2>
        <p>Bring your skills to a challenge with room for new thinking. These are starting points, not boxes to build inside.</p>
      </div>
      <div className="track-grid">
        {tracks.map(({ number, icon: Icon, title, description, tag }) => (
          <article className="track-card" key={number}>
            <div className="track-card-top"><span>{number} / 04</span><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></div>
            <div className="track-card-main">
              <span className="track-tag">{tag}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <span className="track-card-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
          </article>
        ))}
      </div>
    </section>
  );
}

function FormatSection() {
  return (
    <section className="format-section" id="format" aria-labelledby="format-title">
      <div className="section-wrap format-inner">
        <div className="format-heading">
          <div className="section-kicker"><span>03</span><span>THE BUILD</span></div>
          <h2 id="format-title">From a question<br />to <span>something real.</span></h2>
          <p>No perfect pitch required. Just curiosity, a point of view, and the willingness to make a first version.</p>
          <span className="format-doodle" aria-hidden="true"><Lightbulb size={36} strokeWidth={1.25} /></span>
        </div>
        <div className="moment-list">
          {moments.map((moment) => (
            <article className="moment-row" key={moment.number}>
              <span className="moment-number">{moment.number}</span>
              <div><h3>{moment.title}</h3><p>{moment.description}</p></div>
              <ArrowUpRight className="moment-arrow" size={19} aria-hidden="true" />
            </article>
          ))}
          <div className="format-note"><span className="live-dot" aria-hidden="true" /> DATES + EVENT FORMAT COMING SOON</div>
        </div>
      </div>
    </section>
  );
}

function PeopleSection() {
  return (
    <section className="people-section section-wrap" aria-labelledby="people-title">
      <div className="people-visual">
        <div className="people-orbit people-orbit-one" aria-hidden="true" />
        <div className="people-orbit people-orbit-two" aria-hidden="true" />
        <div className="people-core"><UsersRound size={45} strokeWidth={1.15} aria-hidden="true" /></div>
        <span className="orbit-label orbit-label-one">DESIGN</span>
        <span className="orbit-label orbit-label-two">CODE</span>
        <span className="orbit-label orbit-label-three">CARE</span>
        <span className="orbit-label orbit-label-four">CURIOSITY</span>
        <span className="orbit-caption">GOOD THINGS HAPPEN<br />BETWEEN DIFFERENT PEOPLE</span>
      </div>
      <div className="people-copy">
        <div className="section-kicker"><span>04</span><span>WHO IT&apos;S FOR</span></div>
        <h2 id="people-title">Not a spectator.<br /><span>A co-conspirator.</span></h2>
        <p>You don&apos;t need a certain title to belong here. Bring a perspective, a half-formed idea, a skill you&apos;re still learning, or just a question you can&apos;t stop asking.</p>
        <ul className="people-list">
          <li><span>01</span> Makers who learn by trying</li>
          <li><span>02</span> Designers who care about the details</li>
          <li><span>03</span> Builders who start with people</li>
          <li><span>04</span> First-timers with a point of view</li>
        </ul>
        <a className="text-link" href="#join">Find your place in it <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="faq-section section-wrap" id="faq" aria-labelledby="faq-title">
      <div className="faq-heading">
        <div className="section-kicker"><span>05</span><span>GOOD QUESTIONS</span></div>
        <h2 id="faq-title">The details<br /><span>are taking shape.</span></h2>
        <p>We&apos;re building the event with the community. Here&apos;s what we can share right now.</p>
      </div>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <details className="faq-item" key={item.question}>
            <summary><span className="faq-index">0{index + 1}</span><span>{item.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function JoinSection() {
  return (
    <section className="join-section" id="join" aria-labelledby="join-title">
      <div className="join-topline"><span>THE FIRST STEP IS SMALL</span><span>HORIZON / GLOBAL EDITION</span></div>
      <div className="join-layout">
        <div className="join-copy">
          <p className="eyebrow"><span className="live-dot" aria-hidden="true" /> Interest list is open</p>
          <h2 id="join-title">Be there<br />when it <span>starts.</span></h2>
          <p>Get the first word on dates, the official application, and what we&apos;re building together. No noise — just the important updates.</p>
          <div className="join-assurance"><Globe2 size={16} aria-hidden="true" /> For curious people, everywhere.</div>
        </div>
        <WaitlistForm />
      </div>
      <div className="join-bottomline"><span>HORIZON HACKATHON</span><span>BUILD WHAT&apos;S NEXT, TOGETHER.</span></div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="footer-mark" href="#top"><Globe2 size={17} aria-hidden="true" /> HORIZON<span>.</span></a>
      <p>Made for the people building a more useful future.</p>
      <a className="footer-back" href="#top">Back to top <ArrowUpRight size={14} aria-hidden="true" /></a>
    </footer>
  );
}

export function Landing() {
  return (
    <main className="hackathon-site">
      <div className="announcement-bar"><span className="announcement-label"><Sparkles size={13} aria-hidden="true" /> THE WORLDWIDE BUILD IS COMING</span><span>Dates announced soon <ArrowRight size={13} aria-hidden="true" /></span></div>
      <SiteHeader />
      <Hero />
      <SignalStrip />
      <IntroSection />
      <TracksSection />
      <FormatSection />
      <PeopleSection />
      <FaqSection />
      <JoinSection />
      <SiteFooter />
    </main>
  );
}
