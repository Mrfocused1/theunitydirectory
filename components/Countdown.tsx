"use client";
import { useEffect, useState } from "react";

const KICKOFF = new Date("2026-05-26T18:30:00Z").getTime();
const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  const [t, setT] = useState<{ d: string; h: string; m: string } | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = KICKOFF - Date.now();
      if (diff <= 0) {
        setDone(true);
        return;
      }
      const s = Math.floor(diff / 1000);
      setT({
        d: pad(Math.floor(s / 86400)),
        h: pad(Math.floor((s % 86400) / 3600)),
        m: pad(Math.floor((s % 3600) / 60)),
      });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (done) {
    return (
      <div className="nav-cd">
        <span>Time&apos;s up!</span>
      </div>
    );
  }

  return (
    <div className="nav-cd">
      <span className="nav-cd-text">Kick-off in...</span>
      <div className="nav-cd-timer">
        <div className="nav-cd-unit">
          <span className="nav-cd-num">{t?.d ?? "--"}</span>
          <span className="nav-cd-label">d</span>
        </div>
        <div className="nav-cd-unit">
          <span className="nav-cd-num">{t?.h ?? "--"}</span>
          <span className="nav-cd-label">h</span>
        </div>
        <div className="nav-cd-unit">
          <span className="nav-cd-num">{t?.m ?? "--"}</span>
          <span className="nav-cd-label">m</span>
        </div>
      </div>
      <style>{`
        .nav-cd { display: flex; align-items: center; gap: 8px; }
        .nav-cd-timer { display: flex; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
        .nav-cd-unit { display: flex; align-items: baseline; gap: 2px; }
      `}</style>
    </div>
  );
}
