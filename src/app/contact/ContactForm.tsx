"use client";

import { useEffect, useState, type FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const recaptchaConfigured =
  RECAPTCHA_SITE_KEY !== "" && RECAPTCHA_SITE_KEY !== "your-recaptcha-site-key";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [compactCaptcha, setCompactCaptcha] = useState(false);

  // The standard 304px widget overflows the form card on very narrow phones.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 399px)");
    const update = () => setCompactCaptcha(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function handleCaptchaChange(token: string | null) {
    setCaptchaToken(token);
    if (token) setCaptchaError(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // NOTE: This is a static frontend with no backend, so reCAPTCHA here is
    // client-side bot deterrence only. Real protection needs the token
    // verified server-side (Google siteverify) from a backend endpoint,
    // which is intentionally out of scope for now.
    if (!captchaToken) {
      setCaptchaError("Please complete the CAPTCHA to confirm you're not a robot.");
      return;
    }

    // EmailJS send will be wired in here.
    setSubmitted(true);
  }

  function resetForm() {
    setCaptchaToken(null);
    setCaptchaError(null);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-teal/30 bg-teal/[0.04] p-8 text-center shadow-glow-teal">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-teal/50 bg-teal/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-6 w-6 text-teal-light"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-bold text-ink">Message sent</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          Thanks for reaching out — someone from our team will follow up by
          email shortly.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-6 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:border-teal/40 hover:bg-white/10"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="font-mono text-xs uppercase tracking-widest text-ink/50"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 w-full rounded-md border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-teal/50 focus:outline-none focus:ring-1 focus:ring-teal/50"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="font-mono text-xs uppercase tracking-widest text-ink/50"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-md border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-teal/50 focus:outline-none focus:ring-1 focus:ring-teal/50"
            placeholder="jane@hospital.org"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="organization"
          className="font-mono text-xs uppercase tracking-widest text-ink/50"
        >
          Organization
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          className="mt-2 w-full rounded-md border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-teal/50 focus:outline-none focus:ring-1 focus:ring-teal/50"
          placeholder="Imaging department, hospital, or company"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="font-mono text-xs uppercase tracking-widest text-ink/50"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full resize-none rounded-md border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-teal/50 focus:outline-none focus:ring-1 focus:ring-teal/50"
          placeholder="Tell us about your imaging department and what you're looking for."
        />
      </div>

      <div>
        {recaptchaConfigured ? (
          <ReCAPTCHA
            key={compactCaptcha ? "compact" : "normal"}
            sitekey={RECAPTCHA_SITE_KEY}
            theme="dark"
            size={compactCaptcha ? "compact" : "normal"}
            onChange={handleCaptchaChange}
            onExpired={() => handleCaptchaChange(null)}
            onErrored={() =>
              setCaptchaError(
                "The CAPTCHA failed to load. Check your connection and refresh the page."
              )
            }
          />
        ) : (
          <p className="rounded-md border border-amber/40 bg-amber/10 px-4 py-3 text-xs leading-relaxed text-amber-light">
            CAPTCHA isn&apos;t configured yet. Add{" "}
            <span className="font-mono">NEXT_PUBLIC_RECAPTCHA_SITE_KEY</span> to{" "}
            <span className="font-mono">.env.local</span> and restart the dev
            server.
          </p>
        )}
        {captchaError && (
          <p role="alert" className="mt-2 text-xs text-amber-light">
            {captchaError}
          </p>
        )}
      </div>

      {/* A disabled button swallows clicks, so the wrapper catches them and shows the error. */}
      <div
        className="w-full sm:w-auto sm:inline-block"
        onClick={() => {
          if (!captchaToken) {
            setCaptchaError(
              "Please complete the CAPTCHA to confirm you're not a robot."
            );
          }
        }}
      >
        <button
          type="submit"
          disabled={!captchaToken}
          className="w-full rounded-md bg-teal px-6 py-3 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}
