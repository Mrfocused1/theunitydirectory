"use client";
import { useMemo, useState } from "react";
import MapClient, { type MapSelection } from "@/components/MapClient";
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
          l.url
            ? { label: "Website", value: prettyUrl(l.url), href: l.url, external: true }
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
        <a
          href={gmapsHref(l.address)}
          target="_blank"
          rel="noreferrer"
          className="button w-inline-block"
        >
          <div>Directions</div>
        </a>
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
  }
`;
