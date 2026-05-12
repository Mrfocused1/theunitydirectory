"use client";
import { useState, type ReactNode } from "react";

export function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq">
      <div className={`accordion-item${open ? " is-open" : ""}`}>
        <button
          type="button"
          className="accordion-item-trigger"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", width: "100%", textAlign: "left", padding: 0, font: "inherit" }}
        >
          <div className="accordion-title-block">
            <div>{question}</div>
            <div className="holder _8-column">
              <div className="accordion-arrow-div" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s" }}>
                <div className="wayfinding w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 12l-4-4-4 4M12 16V9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </button>
        {open && (
          <div className="accordion-item-content">
            <div className="faq-paragraph w-richtext">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
}
