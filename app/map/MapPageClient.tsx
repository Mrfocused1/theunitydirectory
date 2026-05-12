"use client";
import { useMemo, useState } from "react";
import MapClient, { type MapSelection } from "@/components/MapClient";
import DirectionsMenu from "@/components/DirectionsMenu";
import {
  COUNTRIES,
  STADIUM,
  distanceKm,
  formatDistance,
  type Country,
  type Listing,
} from "@/lib/data";

type RadiusKm = 2 | 5 | 10 | "all";

export default function MapPageClient({
  listings,
}: {
  listings: Listing[];
  countries: typeof COUNTRIES;
}) {
  const [active, setActive] = useState<Record<Country, boolean>>({
    nigeria: true,
    jamaica: true,
    zimbabwe: true,
    india: true,
  });
  const [radius, setRadius] = useState<RadiusKm>(5);
  const [selected, setSelected] = useState<MapSelection>(null);

  const stadium = { lat: STADIUM.lat, lng: STADIUM.lng };

  const visibleListings = useMemo(() => {
    return listings.filter((l) => {
      if (!active[l.country]) return false;
      if (radius !== "all" && distanceKm(stadium, l) > radius) return false;
      return true;
    });
  }, [listings, active, radius]);

  return (
    <>
      <div className="map-controls _24-below">
        <div className="map-toggles" role="group" aria-label="Cuisine filters">
          {(Object.keys(COUNTRIES) as Country[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive((a) => ({ ...a, [c]: !a[c] }))}
              className="map-toggle"
              data-active={active[c]}
              style={{ borderColor: COUNTRIES[c].color }}
            >
              <span
                className="map-toggle-dot"
                style={{
                  background: active[c] ? COUNTRIES[c].color : "transparent",
                  borderColor: COUNTRIES[c].color,
                }}
              />
              {COUNTRIES[c].flag} {COUNTRIES[c].name}
            </button>
          ))}
        </div>

        <div className="map-radius">
          <span className="eyebrow" style={{ opacity: 0.7 }}>Within</span>
          {(["2", "5", "10", "all"] as const).map((r) => {
            const v = r === "all" ? "all" : (Number(r) as 2 | 5 | 10);
            return (
              <button
                key={r}
                type="button"
                className="map-radius-btn"
                data-active={radius === v}
                onClick={() => setRadius(v)}
              >
                {r === "all" ? "all London" : `${r} km of stadium`}
              </button>
            );
          })}
        </div>
      </div>

      <MapClient listings={visibleListings} height={640} onSelect={setSelected} />

      <div className="eyebrow _12-below" style={{ marginTop: 16 }}>
        Showing {visibleListings.length} {visibleListings.length === 1 ? "place" : "places"}
        {radius !== "all" && ` within ${radius} km of ${STADIUM.name}`}
      </div>

      <DetailsPanel selection={selected} onClose={() => setSelected(null)} />

      <style>{`
        .map-controls { display: flex; flex-direction: column; gap: 12px; }
        .map-toggles { display: flex; flex-wrap: wrap; gap: 10px; }
        .map-toggle {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 14px; border-radius: 999px;
          border: 1px solid; background: transparent; cursor: pointer;
          color: var(--_colours---light);
          font-family: DM Sans, Arial, sans-serif; font-size: 14px;
          transition: opacity .2s;
        }
        .map-toggle[data-active="false"] { opacity: 0.45; }
        .map-toggle-dot {
          width: 12px; height: 12px; border-radius: 999px;
          border: 1px solid; display: inline-block;
        }
        .map-radius { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .map-radius-btn {
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
        .map-radius-btn[data-active="true"] {
          opacity: 1;
          border-color: var(--_colours---light);
        }
      `}</style>
    </>
  );
}

function DetailsPanel({
  selection,
  onClose,
}: {
  selection: MapSelection;
  onClose: () => void;
}) {
  if (!selection) {
    return (
      <div className="details-panel details-empty" style={{ marginTop: 40 }}>
        <div className="eyebrow _8-below">Selected place</div>
        <p style={{ opacity: 0.6, margin: 0 }}>
          Click any marker on the map to see address, contact and links here.
        </p>
        <style>{detailsCss}</style>
      </div>
    );
  }

  if (selection.kind === "stadium") {
    return (
      <div className="details-panel" style={{ marginTop: 40, borderColor: "#ffb81c" }}>
        <CloseButton onClick={onClose} />
        <div className="eyebrow _8-below" style={{ color: "#ffb81c", opacity: 1 }}>
          🏟️ Match venue
        </div>
        <h2 className="l-title _12-below">{STADIUM.name}</h2>
        <div className="m-title _24-below" style={{ opacity: 0.7, fontWeight: 300 }}>
          {STADIUM.subtitle}
        </div>
        <DetailsGrid
          rows={[
            { label: "Address", value: STADIUM.address, href: gmapsHref(STADIUM.address) },
          ]}
        />
        <style>{detailsCss}</style>
      </div>
    );
  }

  const l = selection.data;
  const c = COUNTRIES[l.country];
  return (
    <div className="details-panel" style={{ marginTop: 40, borderColor: c.color }}>
      <CloseButton onClick={onClose} />
      <div className="eyebrow _8-below" style={{ color: c.color, opacity: 1 }}>
        {c.flag} {c.cuisine} · {l.type}
      </div>
      <h2 className="l-title _12-below">{l.name}</h2>
      <div className="eyebrow _24-below">
        {l.area} · {l.priceRange} · {formatDistance(distanceKm({ lat: STADIUM.lat, lng: STADIUM.lng }, l))} from the stadium
      </div>
      <p className="_24-below" style={{ maxWidth: 720 }}>{l.summary}</p>

      <DetailsGrid
        rows={[
          { label: "Address", value: l.address, href: gmapsHref(l.address) },
          l.phone
            ? { label: "Phone", value: l.phone, href: `tel:${l.phone.replace(/\s+/g, "")}` }
            : null,
          l.hours ? { label: "Hours", value: l.hours } : null,
          l.url
            ? { label: "Website", value: prettyUrl(l.url), href: l.url, external: true }
            : null,
          l.instagram
            ? {
                label: "Instagram",
                value: `@${l.instagram}`,
                href: `https://instagram.com/${l.instagram}`,
                external: true,
              }
            : null,
        ].filter(Boolean) as Row[]}
      />

      {l.tags.length > 0 && (
        <div className="details-tags" style={{ marginTop: 24 }}>
          {l.tags.map((t) => (
            <span key={t} className="details-tag">{t}</span>
          ))}
        </div>
      )}

      <div className="details-actions">
        <DirectionsMenu lat={l.lat} lng={l.lng} />
        {l.url && (
          <a
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="button outline w-inline-block"
          >
            <div>Visit website</div>
          </a>
        )}
        {l.instagram && (
          <a
            href={`https://instagram.com/${l.instagram}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`${l.name} on Instagram`}
            className="details-ig"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
            </svg>
          </a>
        )}
      </div>

      <style>{detailsCss}</style>
    </div>
  );
}

type Row = { label: string; value: string; href?: string; external?: boolean };

function DetailsGrid({ rows }: { rows: Row[] }) {
  return (
    <dl className="details-grid">
      {rows.map((r) => (
        <div key={r.label} className="details-row">
          <dt className="eyebrow">{r.label}</dt>
          <dd>
            {r.href ? (
              <a
                href={r.href}
                target={r.external ? "_blank" : undefined}
                rel={r.external ? "noreferrer" : undefined}
                className="details-link"
              >
                {r.value}
              </a>
            ) : (
              r.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close details"
      className="details-close"
    >
      ×
    </button>
  );
}

function gmapsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function prettyUrl(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const detailsCss = `
  .details-panel {
    position: relative;
    padding: 32px;
    border: 1px solid rgba(252,241,218,0.15);
    border-left-width: 4px;
    border-radius: 4px;
    background: rgba(252,241,218,0.04);
  }
  .details-empty {
    border-left-color: rgba(252,241,218,0.3) !important;
  }
  .details-close {
    position: absolute;
    top: 16px; right: 16px;
    width: 36px; height: 36px;
    border-radius: 999px;
    border: 1px solid rgba(252,241,218,0.25);
    background: transparent;
    color: var(--_colours---light);
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    transition: all .2s;
  }
  .details-close:hover {
    background: rgba(252,241,218,0.08);
    border-color: var(--_colours---light);
  }
  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px 32px;
    margin: 0;
  }
  .details-row dt { margin-bottom: 6px; }
  .details-row dd { margin: 0; font-family: DM Sans, Arial, sans-serif; font-size: 16px; line-height: 1.5; }
  .details-link {
    color: var(--_colours---light);
    text-decoration: underline;
    text-decoration-color: rgba(252,241,218,0.35);
    text-underline-offset: 3px;
    transition: text-decoration-color .2s;
  }
  .details-link:hover { text-decoration-color: var(--_colours---light); }
  .details-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .details-tag {
    font-size: 12px;
    padding: 4px 10px;
    border: 1px solid rgba(252,241,218,0.25);
    border-radius: 999px;
    opacity: 0.85;
  }
  .details-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 32px;
    align-items: center;
  }
  .details-ig {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px; height: 44px;
    border: 1px solid var(--_colours---light);
    border-radius: 2px;
    color: var(--_colours---light);
    transition: all .2s;
  }
  .details-ig:hover {
    background: var(--_colours---light);
    color: #0c1a12;
  }
`;
