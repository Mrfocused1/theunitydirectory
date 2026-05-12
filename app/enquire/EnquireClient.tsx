"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { COUNTRIES, type Country } from "@/lib/data";

type EnquiryType = "general" | "feature" | "sponsor";

const REASONS: { id: EnquiryType; label: string; hint: string }[] = [
  { id: "general", label: "General query", hint: "Press, partnerships, corrections, anything else." },
  { id: "feature", label: "Feature my spot", hint: "Restaurant, bar, cafe, market, or supper-club owners." },
  { id: "sponsor", label: "Sponsorship", hint: "Brands wanting to sponsor the directory or an event." },
];

export default function EnquireClient() {
  const sp = useSearchParams();
  const initial = (sp.get("type") as EnquiryType | null) ?? "general";

  const [type, setType] = useState<EnquiryType>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = sp.get("type") as EnquiryType | null;
    if (t && t !== type) setType(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...data }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="enquiry-success">
        <div className="m-title _12-below">Thanks &mdash; we&rsquo;ve got it.</div>
        <p>We&rsquo;ll reply within one working day. In the meantime, browse the directory or map.</p>
        <style>{`
          .enquiry-success {
            padding: 32px;
            border: 1px solid rgba(252,241,218,0.25);
            border-radius: 4px;
            background: rgba(252,241,218,0.04);
          }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="enquiry-form">
      <fieldset className="enquiry-reasons">
        <legend className="eyebrow _12-below">What&rsquo;s this about?</legend>
        {REASONS.map((r) => (
          <label key={r.id} className="enquiry-reason" data-active={type === r.id}>
            <input
              type="radio"
              name="reason"
              value={r.id}
              checked={type === r.id}
              onChange={() => setType(r.id)}
            />
            <div>
              <div className="enquiry-reason-label">{r.label}</div>
              <div className="enquiry-reason-hint">{r.hint}</div>
            </div>
          </label>
        ))}
      </fieldset>

      <div className="enquiry-grid">
        <div>
          <label className="enquiry-field-label">Your name</label>
          <input required name="name" type="text" className="enquiry-input" />
        </div>
        <div>
          <label className="enquiry-field-label">Email</label>
          <input required name="email" type="email" className="enquiry-input" />
        </div>
      </div>

      {type === "feature" && (
        <>
          <div className="enquiry-grid">
            <div>
              <label className="enquiry-field-label">Venue name</label>
              <input required name="venue" type="text" className="enquiry-input" />
            </div>
            <div>
              <label className="enquiry-field-label">Country</label>
              <select required name="country" className="enquiry-input" defaultValue="">
                <option value="" disabled>Pick one</option>
                {(Object.keys(COUNTRIES) as Country[]).map((c) => (
                  <option key={c} value={c}>
                    {COUNTRIES[c].flag} {COUNTRIES[c].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="enquiry-field-label">Address or postcode</label>
            <input required name="address" type="text" className="enquiry-input" />
          </div>
          <div>
            <label className="enquiry-field-label">Website or Instagram</label>
            <input name="link" type="url" placeholder="https://" className="enquiry-input" />
          </div>
        </>
      )}

      {type === "sponsor" && (
        <>
          <div className="enquiry-grid">
            <div>
              <label className="enquiry-field-label">Company</label>
              <input required name="company" type="text" className="enquiry-input" />
            </div>
            <div>
              <label className="enquiry-field-label">Indicative budget</label>
              <select name="budget" className="enquiry-input" defaultValue="">
                <option value="" disabled>Pick one</option>
                <option>Under £5k</option>
                <option>£5k &ndash; £20k</option>
                <option>£20k &ndash; £100k</option>
                <option>Over £100k</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div>
        <label className="enquiry-field-label">
          {type === "feature"
            ? "Tell us about your spot"
            : type === "sponsor"
            ? "Tell us about your brand and what you have in mind"
            : "Your message"}
        </label>
        <textarea required name="message" rows={6} className="enquiry-input" />
      </div>

      {error && (
        <div style={{ color: "#ef3340", fontSize: 14 }}>
          Something went wrong: {error}. Try again, or email{" "}
          <a href="mailto:hello@unitycup.com" style={{ textDecoration: "underline" }}>
            hello@unitycup.com
          </a>
          .
        </div>
      )}

      <div>
        <button type="submit" disabled={submitting} className="button w-inline-block" style={{ cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>
          <div>{submitting ? "Sending…" : "Send enquiry"}</div>
        </button>
      </div>

      <style>{`
        .enquiry-form { display: flex; flex-direction: column; gap: 24px; }
        .enquiry-reasons { border: 0; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 767px) { .enquiry-reasons { grid-template-columns: 1fr; } }
        .enquiry-reason {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 16px;
          border: 1px solid rgba(252,241,218,0.25);
          border-radius: 4px;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .enquiry-reason[data-active="true"] {
          border-color: var(--_colours---light);
          background: rgba(252,241,218,0.06);
        }
        .enquiry-reason input { margin-top: 4px; }
        .enquiry-reason-label { font-family: Stack Sans, Arial, sans-serif; font-weight: 500; }
        .enquiry-reason-hint { font-size: 13px; opacity: 0.7; margin-top: 4px; }
        .enquiry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 767px) { .enquiry-grid { grid-template-columns: 1fr; } }
        .enquiry-field-label {
          display: block; margin-bottom: 8px;
          font-size: 13px; letter-spacing: 2px;
          text-transform: uppercase; opacity: 0.7; font-weight: 500;
        }
        .enquiry-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 2px;
          border: 1px solid rgba(252,241,218,0.4);
          background: transparent;
          color: var(--_colours---light);
          font-family: DM Sans, Arial, sans-serif;
          font-size: 16px;
        }
        textarea.enquiry-input { resize: vertical; min-height: 120px; }
      `}</style>
    </form>
  );
}
