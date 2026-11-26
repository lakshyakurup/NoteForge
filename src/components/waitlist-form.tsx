"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";

const tracks = [
  ["climate", "Climate resilience"],
  ["learning", "Learning without limits"],
  ["civic-tech", "Civic life, reimagined"],
  ["open-track", "I have another idea"],
] as const;

type FormState = "idle" | "submitting" | "success" | "error";

export function WaitlistForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          country: formData.get("country"),
          track: formData.get("track"),
          updatesOptIn: formData.get("updatesOptIn") === "on",
          website: formData.get("website"),
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We couldn’t save that just now. Please try again.");
      }

      setState("success");
      setMessage(result.message || "You’re on the list. We’ll be in touch when there’s news.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} aria-labelledby="form-title">
      <div className="form-heading">
        <span className="form-kicker">EARLY SIGNAL / 001</span>
        <h3 id="form-title">Keep me in the loop.</h3>
        <p>Leave a few details. We’ll send one note when the next chapter is ready.</p>
      </div>
      <div className="form-fields">
        <label className="form-field">
          <span>Your name</span>
          <input autoComplete="name" name="fullName" placeholder="How should we say hello?" required minLength={2} maxLength={100} />
        </label>
        <label className="form-field">
          <span>Email address</span>
          <input autoComplete="email" name="email" type="email" placeholder="you@example.com" required maxLength={254} />
        </label>
        <div className="form-field-row">
          <label className="form-field">
            <span>Where are you building from?</span>
            <input autoComplete="country-name" name="country" placeholder="Country or region" required minLength={2} maxLength={80} />
          </label>
          <label className="form-field">
            <span>What are you curious about?</span>
            <select name="track" defaultValue="" required>
              <option value="" disabled>Choose a challenge</option>
              {tracks.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
      </div>
      <label className="honeypot" aria-hidden="true">
        <span>Leave this field empty</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent-field">
        <input type="checkbox" name="updatesOptIn" required />
        <span>I agree to receive email updates about this event.</span>
      </label>
      <button className="button button-primary form-submit" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? <><LoaderCircle className="spinner" size={17} aria-hidden="true" /> Adding you…</> : <>Join the interest list <ArrowRight size={17} aria-hidden="true" /></>}
      </button>
      <p className={`form-feedback ${state}`} role="status" aria-live="polite">
        {state === "success" && <Check size={16} aria-hidden="true" />}
        {message || "Only used for updates about this event."}
      </p>
    </form>
  );
}
