"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/directory", label: "Directory" },
  { href: "/map", label: "Map" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + close on ESC when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div role="banner" className="tud-nav">
        <div className="tud-nav-inner">
          <Link href="/" aria-label="The Unity Directory" className="tud-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.svg" alt="The Unity Directory" className="tud-logo" />
          </Link>

          {/* Desktop links */}
          <nav className="tud-nav-desktop" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="tud-nav-link"
                data-active={pathname === l.href || pathname.startsWith(l.href + "/")}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/enquire" className="button outline w-inline-block tud-nav-cta">
              <div>Enquire</div>
            </Link>
            <ThemeToggle compact />
            <a
              href="https://instagram.com/unitycupfootball"
              target="_blank"
              rel="noreferrer"
              className="link-opacity"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </nav>

          {/* Mobile burger */}
          <button
            type="button"
            className="tud-nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="tud-mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`tud-burger-bar ${open ? "is-x1" : ""}`} />
            <span className={`tud-burger-bar ${open ? "is-x2" : ""}`} />
            <span className={`tud-burger-bar ${open ? "is-x3" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        id="tud-mobile-menu"
        className={`tud-mobile-menu ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <nav className="tud-mobile-list" aria-label="Mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="tud-mobile-link">
              {l.label}
            </Link>
          ))}
          <Link href="/enquire" className="tud-mobile-link tud-mobile-link--cta">
            Enquire
          </Link>
          <div style={{ padding: "18px 0", borderBottom: "1px solid rgba(252,241,218,0.12)" }}>
            <ThemeToggle />
          </div>
          <a
            href="https://instagram.com/unitycupfootball"
            target="_blank"
            rel="noreferrer"
            className="tud-mobile-link tud-mobile-link--sub"
          >
            <InstagramIcon size={22} /> <span style={{ marginLeft: 12 }}>Instagram</span>
          </a>
        </nav>
      </div>

      <style>{`
        .tud-nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(12, 26, 18, 0.85);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(252, 241, 218, 0.08);
        }
        .tud-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 14px 24px;
        }
        @media (max-width: 600px) {
          .tud-nav-inner { padding: 12px 16px; }
        }
        .tud-brand { display: inline-flex; align-items: center; flex-shrink: 0; }
        .tud-logo { height: 32px; width: auto; display: block; }

        .tud-nav-desktop {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .tud-nav-link {
          font-family: Stack Sans, Arial, sans-serif;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.5px;
          color: var(--_colours---light);
          opacity: 0.75;
          transition: opacity .2s;
          position: relative;
        }
        .tud-nav-link:hover { opacity: 1; }
        .tud-nav-link[data-active="true"] { opacity: 1; }
        .tud-nav-link[data-active="true"]::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -6px;
          height: 2px;
          background: #ffb81c;
        }
        .tud-nav-cta { padding: 8px 16px !important; font-size: 14px; }

        .tud-nav-burger {
          display: none;
          width: 44px; height: 44px;
          align-items: center; justify-content: center;
          flex-direction: column; gap: 5px;
          background: transparent;
          border: 1px solid rgba(252, 241, 218, 0.25);
          border-radius: 4px;
          cursor: pointer;
          padding: 0;
        }
        .tud-burger-bar {
          display: block;
          width: 20px; height: 2px;
          background: var(--_colours---light);
          transition: transform .25s, opacity .25s;
          transform-origin: center;
        }
        .tud-burger-bar.is-x1 { transform: translateY(7px) rotate(45deg); }
        .tud-burger-bar.is-x2 { opacity: 0; }
        .tud-burger-bar.is-x3 { transform: translateY(-7px) rotate(-45deg); }

        .tud-mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: #0c1a12;
          padding: 96px 24px 32px;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-10px);
          transition: opacity .25s, transform .25s;
          overflow-y: auto;
        }
        .tud-mobile-menu.is-open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .tud-mobile-list {
          display: flex;
          flex-direction: column;
          max-width: 480px;
          margin: 0 auto;
        }
        .tud-mobile-link {
          font-family: Stack Sans, Arial, sans-serif;
          font-size: 32px;
          font-weight: 500;
          padding: 18px 0;
          border-bottom: 1px solid rgba(252, 241, 218, 0.12);
          color: var(--_colours---light);
          display: flex;
          align-items: center;
        }
        .tud-mobile-link--cta {
          color: #ffb81c;
        }
        .tud-mobile-link--sub {
          font-size: 18px;
          opacity: 0.8;
          border-bottom: 0;
          margin-top: 12px;
        }

        @media (max-width: 880px) {
          .tud-nav-desktop { display: none; }
          .tud-nav-burger { display: flex; }
        }
        @media (min-width: 881px) {
          .tud-mobile-menu { display: none; }
        }
      `}</style>
    </>
  );
}

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
    </svg>
  );
}
