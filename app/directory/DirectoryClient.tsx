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
import DirectionsMenu from "@/components/DirectionsMenu";

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
                <h2 className="m-title" style={{ marginTop: 8, marginBottom: 4 }}>{l.name}</h2>
                <div className="eyebrow _12-below">{l.area}</div>
                <p className="_12-below">{l.summary}</p>

                <ul className="directory-info">
                  <li className="directory-info-row">
                    <PinIcon />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="directory-info-link"
                    >
                      {l.address}
                    </a>
                  </li>
                  {l.phone && (
                    <li className="directory-info-row">
                      <PhoneIcon />
                      <a href={`tel:${l.phone.replace(/\s+/g, "")}`} className="directory-info-link">
                        {l.phone}
                      </a>
                    </li>
                  )}
                  {l.hours && (
                    <li className="directory-info-row">
                      <ClockIcon />
                      <span>{l.hours}</span>
                    </li>
                  )}
                </ul>

                {l.tags.length > 0 && (
                  <div className="directory-tags _12-below">
                    {l.tags.map((t) => (
                      <span key={t} className="directory-tag">{t}</span>
                    ))}
                  </div>
                )}

                <div className="directory-actions">
                  <DirectionsMenu lat={l.lat} lng={l.lng} variant="outline" />
                  {l.url && (
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="button outline w-inline-block"
                    >
                      <div>Website</div>
                    </a>
                  )}
                  {l.instagram && (
                    <a
                      href={`https://instagram.com/${l.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${l.name} on Instagram`}
                      className="directory-ig"
                    >
                      <InstagramIcon />
                    </a>
                  )}
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
        .directory-info {
          list-style: none;
          margin: 0 0 16px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          line-height: 1.4;
        }
        .directory-info-row {
          display: grid;
          grid-template-columns: 16px 1fr;
          gap: 10px;
          align-items: start;
          color: var(--_colours---light);
        }
        .directory-info-row svg {
          opacity: 0.55;
          margin-top: 3px;
          flex-shrink: 0;
        }
        .directory-info-link {
          color: var(--_colours---light);
          text-decoration: underline;
          text-decoration-color: rgba(252,241,218,0.2);
          text-underline-offset: 3px;
          transition: text-decoration-color .2s;
        }
        .directory-info-link:hover { text-decoration-color: var(--_colours---light); }
        .directory-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .directory-tag {
          font-size: 12px;
          padding: 4px 10px;
          border: 1px solid rgba(252, 241, 218, 0.25);
          border-radius: 999px;
          opacity: 0.85;
        }
        .directory-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-top: auto;
        }
        .directory-ig {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border: 1px solid var(--_colours---light);
          border-radius: 2px;
          color: var(--_colours---light);
          transition: background .2s;
        }
        .directory-ig:hover {
          background: var(--_colours---light);
          color: #0c1a12;
        }
      `}</style>
    </>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
    </svg>
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
