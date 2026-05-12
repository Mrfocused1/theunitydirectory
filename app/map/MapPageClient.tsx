"use client";
import { useMemo, useState } from "react";
import MapClient from "@/components/MapClient";
import { type Country, type Listing, type EventItem, COUNTRIES } from "@/lib/data";

export default function MapPageClient({
  listings,
  events,
}: {
  listings: Listing[];
  events: EventItem[];
  countries: typeof COUNTRIES;
}) {
  const [active, setActive] = useState<Record<Country, boolean>>({
    nigeria: true,
    jamaica: true,
    zimbabwe: true,
    india: true,
  });
  const [showEvents, setShowEvents] = useState(true);

  const visibleListings = useMemo(
    () => listings.filter((l) => active[l.country]),
    [listings, active]
  );
  const visibleEvents = useMemo(
    () =>
      showEvents
        ? events.filter((e) => e.country === "all" || active[e.country as Country])
        : [],
    [events, active, showEvents]
  );

  return (
    <>
      <div className="map-toggles _24-below">
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
              style={{ background: active[c] ? COUNTRIES[c].color : "transparent", borderColor: COUNTRIES[c].color }}
            />
            {COUNTRIES[c].flag} {COUNTRIES[c].name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowEvents((s) => !s)}
          className="map-toggle"
          data-active={showEvents}
          style={{ borderColor: "#fcf1da" }}
        >
          <span
            className="map-toggle-dot"
            style={{ background: showEvents ? "#fcf1da" : "transparent", borderColor: "#fcf1da" }}
          />
          🏆 Events
        </button>
      </div>

      <MapClient listings={visibleListings} events={visibleEvents} height={640} />

      <div className="eyebrow _12-below" style={{ marginTop: 16 }}>
        Showing {visibleListings.length} venues and {visibleEvents.length} events
      </div>

      <style>{`
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
      `}</style>
    </>
  );
}
