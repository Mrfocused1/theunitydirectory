"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  COUNTRIES,
  STADIUM,
  distanceKm,
  formatDistance,
  type Country,
  type Listing,
  type LatLng,
} from "@/lib/data";

type ProximityMode = "stadium" | "me" | "off";
type RadiusKm = 2 | 5 | 10 | "all";

const TYPES: Listing["type"][] = ["restaurant", "cafe", "bar", "market", "supper-club"];

export default function DirectoryClient({
  listings,
  areas,
}: {
  listings: Listing[];
  areas: string[];
  countries: typeof COUNTRIES;
}) {
  const sp = useSearchParams();
  const initialCountry = (sp.get("country") as Country | null) ?? "all";

  const [country, setCountry] = useState<Country | "all">(initialCountry);
  const [type, setType] = useState<Listing["type"] | "all">("all");
  const [area, setArea] = useState<string | "all">("all");
  const [q, setQ] = useState("");

  const [mode, setMode] = useState<ProximityMode>("stadium");
  const [radius, setRadius] = useState<RadiusKm>(5);
  const [me, setMe] = useState<LatLng | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "asking" | "denied" | "unavailable">("idle");

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setGeoState("unavailable");
      return;
    }
    setGeoState("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMode("me");
        setGeoState("idle");
      },
      (err) => {
        setGeoState(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
        setMode("stadium");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 }
    );
  }

  const reference: LatLng | null =
    mode === "stadium" ? { lat: STADIUM.lat, lng: STADIUM.lng } : mode === "me" ? me : null;

  const enriched = useMemo(() => {
    return listings.map((l) => ({
      ...l,
      distance: reference ? distanceKm(reference, l) : null,
    }));
  }, [listings, reference]);

  const filtered = useMemo(() => {
    let r = enriched.filter((l) => {
      if (country !== "all" && l.country !== country) return false;
      if (type !== "all" && l.type !== type) return false;
      if (area !== "all" && l.area !== area) return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        const hay = `${l.name} ${l.summary} ${l.tags.join(" ")} ${l.area}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      if (reference && radius !== "all" && l.distance != null && l.distance > radius) return false;
      return true;
    });
    if (reference) {
      r = r.slice().sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    }
    return r;
  }, [enriched, country, type, area, q, reference, radius]);

  const referenceLabel =
    mode === "stadium" ? `The Valley · ${STADIUM.address.split(",").pop()?.trim()}` : "your location";

  return (
    <>
      {/* Proximity bar */}
      <div className="prox-bar">
        <div className="prox-modes" role="tablist" aria-label="Reference point">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "stadium"}
            className="prox-mode"
            data-active={mode === "stadium"}
            onClick={() => setMode("stadium")}
          >
            <StadiumGlyph /> Near the stadium
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "me"}
            className="prox-mode"
            data-active={mode === "me"}
            onClick={() => (me ? setMode("me") : requestLocation())}
          >
            <MeGlyph /> {me ? "Near me" : geoState === "asking" ? "Locating…" : "Use my location"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "off"}
            className="prox-mode"
            data-active={mode === "off"}
            onClick={() => setMode("off")}
          >
            All London
          </button>
        </div>

        {mode !== "off" && (
          <div className="prox-radius" aria-label="Radius">
            <span className="eyebrow" style={{ opacity: 0.7 }}>Radius</span>
            {(["2", "5", "10", "all"] as const).map((r) => {
              const v = r === "all" ? "all" : (Number(r) as 2 | 5 | 10);
              return (
                <button
                  key={r}
                  type="button"
                  className="prox-radius-btn"
                  data-active={radius === v}
                  onClick={() => setRadius(v)}
                >
                  {r === "all" ? "all" : `${r} km`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {mode === "me" && geoState === "denied" && (
        <div className="prox-warning">
          Location permission denied. Enable it in your browser to use &ldquo;Near me&rdquo;.
        </div>
      )}
      {geoState === "unavailable" && (
        <div className="prox-warning">
          Couldn&rsquo;t get your location. Try again, or use &ldquo;Near the stadium&rdquo;.
        </div>
      )}

      {/* Search + dropdown filters */}
      <div className="directory-filters">
        <input
          type="search"
          placeholder="Search by name, tag, area…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="directory-input"
        />
        <select value={country} onChange={(e) => setCountry(e.target.value as Country | "all")} className="directory-input">
          <option value="all">All countries</option>
          {(Object.keys(COUNTRIES) as Country[]).map((c) => (
            <option key={c} value={c}>
              {COUNTRIES[c].flag} {COUNTRIES[c].name}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value as Listing["type"] | "all")} className="directory-input">
          <option value="all">All types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace("-", " ")}
            </option>
          ))}
        </select>
        <select value={area} onChange={(e) => setArea(e.target.value)} className="directory-input">
          <option value="all">All areas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="eyebrow _24-below" style={{ marginTop: 24 }}>
        {filtered.length} {filtered.length === 1 ? "place" : "places"}
        {reference && ` · sorted from ${referenceLabel}`}
      </div>

      <div className="directory-grid">
        {filtered.map((l) => {
          const c = COUNTRIES[l.country];
          return (
            <article key={l.id} id={l.id} className="directory-card">
              <div className="directory-card-stripe" style={{ background: c.color }} aria-hidden />
              <div className="directory-card-body">
                <div className="directory-card-row">
                  <div className="eyebrow" style={{ color: c.color, opacity: 1 }}>
                    {c.flag} {c.cuisine} · {l.type}
                  </div>
                  {l.distance != null && (
                    <span className="directory-distance">{formatDistance(l.distance)}</span>
                  )}
                </div>
                <h2 className="m-title _12-below" style={{ marginTop: 8 }}>{l.name}</h2>
                <p className="_12-below">{l.summary}</p>
                <div className="eyebrow _12-below">{l.area} · {l.priceRange}</div>
                <div className="directory-tags _12-below">
                  {l.tags.map((t) => (
                    <span key={t} className="directory-tag">{t}</span>
                  ))}
                </div>
                <div className="balance">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="button outline w-inline-block"
                  >
                    <div>Directions</div>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="_36-below" style={{ opacity: 0.6 }}>
          No places match your filters. Try widening the radius, or switch to &ldquo;All London&rdquo;.
        </div>
      )}

      <style>{`
        .prox-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          margin-bottom: 16px;
          background: rgba(252, 241, 218, 0.04);
          border: 1px solid rgba(252, 241, 218, 0.12);
          border-radius: 4px;
        }
        .prox-modes { display: flex; flex-wrap: wrap; gap: 8px; }
        .prox-mode {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(252,241,218,0.25);
          background: transparent;
          color: var(--_colours---light);
          font-family: Stack Sans, Arial, sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all .2s;
        }
        .prox-mode:hover { border-color: rgba(252,241,218,0.5); }
        .prox-mode[data-active="true"] {
          background: #ffb81c;
          border-color: #ffb81c;
          color: #0c1a12;
        }
        .prox-radius { display: flex; align-items: center; gap: 8px; }
        .prox-radius-btn {
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(252,241,218,0.2);
          background: transparent;
          color: var(--_colours---light);
          font-family: DM Sans, Arial, sans-serif;
          font-size: 13px;
          cursor: pointer;
          opacity: 0.6;
        }
        .prox-radius-btn[data-active="true"] { opacity: 1; border-color: var(--_colours---light); }
        .prox-warning {
          padding: 12px 16px;
          margin-bottom: 16px;
          border: 1px solid rgba(239, 51, 64, 0.4);
          background: rgba(239, 51, 64, 0.08);
          border-radius: 4px;
          font-size: 14px;
        }
        .directory-filters {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 767px) {
          .directory-filters { grid-template-columns: 1fr 1fr; }
          .prox-bar { flex-direction: column; align-items: stretch; }
          .prox-radius { justify-content: flex-start; }
        }
        .directory-input {
          padding: 12px 14px;
          border-radius: 2px;
          border: 1px solid var(--_colours---light);
          background: transparent;
          color: var(--_colours---light);
          font-family: DM Sans, Arial, sans-serif;
          font-size: 16px;
        }
        .directory-input::placeholder { color: var(--_colours---light); opacity: 0.5; }
        .directory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .directory-card {
          background: rgba(252, 241, 218, 0.04);
          border: 1px solid rgba(252, 241, 218, 0.12);
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .directory-card-stripe { height: 4px; }
        .directory-card-body { padding: 20px; display: flex; flex-direction: column; }
        .directory-card-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .directory-distance {
          font-family: Stack Sans, Arial, sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          background: #ffb81c;
          color: #0c1a12;
          white-space: nowrap;
        }
        .directory-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .directory-tag {
          font-size: 12px;
          padding: 4px 10px;
          border: 1px solid rgba(252, 241, 218, 0.25);
          border-radius: 999px;
          opacity: 0.85;
        }
      `}</style>
    </>
  );
}

function StadiumGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 11h16M4 11c0-3.5 3.6-6 8-6s8 2.5 8 6" />
      <path d="M4 11v3c0 3.5 3.6 6 8 6s8-2.5 8-6v-3" />
    </svg>
  );
}

function MeGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}
