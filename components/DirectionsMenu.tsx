"use client";
import { useEffect, useRef, useState } from "react";

const APPS = [
  {
    id: "google",
    label: "Google Maps",
    color: "#4285f4",
    href: (lat: number, lng: number) =>
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  },
  {
    id: "apple",
    label: "Apple Maps",
    color: "#fcf1da",
    href: (lat: number, lng: number) =>
      `https://maps.apple.com/?daddr=${lat},${lng}`,
  },
  {
    id: "waze",
    label: "Waze",
    color: "#33ccff",
    href: (lat: number, lng: number) =>
      `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
  },
];

export default function DirectionsMenu({
  lat,
  lng,
  variant = "filled",
}: {
  lat: number;
  lng: number;
  variant?: "filled" | "outline";
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; align: "left" | "right" }>({
    top: 0,
    left: 0,
    align: "left",
  });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 220;
      const flipRight = rect.left + menuWidth > window.innerWidth - 16;
      setPos({
        top: rect.bottom + 8,
        left: flipRight ? rect.right - menuWidth : rect.left,
        align: flipRight ? "right" : "left",
      });
    }
    setOpen((o) => !o);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`button ${variant === "outline" ? "outline " : ""}w-inline-block tud-dir-trigger`}
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{ cursor: "pointer" }}
      >
        <div>Directions</div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ marginLeft: 6, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="tud-dir-menu"
          style={{ position: "fixed", top: pos.top, left: pos.left }}
        >
          <div className="tud-dir-menu-label">Open in…</div>
          {APPS.map((app) => (
            <a
              key={app.id}
              role="menuitem"
              href={app.href(lat, lng)}
              target="_blank"
              rel="noreferrer"
              className="tud-dir-menu-item"
              onClick={() => setOpen(false)}
            >
              <span className="tud-dir-dot" style={{ background: app.color }} aria-hidden />
              <span>{app.label}</span>
            </a>
          ))}
        </div>
      )}
      <style>{`
        .tud-dir-trigger { display: inline-flex !important; align-items: center !important; }
        .tud-dir-menu {
          z-index: 1000;
          background: #0c1a12;
          border: 1px solid rgba(252,241,218,0.25);
          border-radius: 6px;
          padding: 6px;
          min-width: 220px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.55);
          font-family: Stack Sans, Arial, sans-serif;
        }
        .tud-dir-menu-label {
          padding: 8px 14px 4px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.5;
          font-weight: 500;
        }
        .tud-dir-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 4px;
          color: var(--_colours---light);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: background .15s;
        }
        .tud-dir-menu-item:hover {
          background: rgba(252,241,218,0.08);
          color: var(--_colours---light);
        }
        .tud-dir-dot {
          width: 12px; height: 12px; border-radius: 999px;
          flex-shrink: 0;
          border: 1px solid rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
}
