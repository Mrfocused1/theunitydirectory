"use client";
import { useMemo, useState } from "react";
import MapClient from "@/components/MapClient";
import {
  COUNTRIES,
  STADIUM,
  distanceKm,
  type Country,
  type Listing,
  type EventItem,
} from "@/lib/data";

type RadiusKm = 2 | 5 | 10 | "all";

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
  const [radius, setRadius] = useState<RadiusKm>(5);

  const stadium = { lat: STADIUM.lat, lng: STADIUM.lng };

  const visibleListings = useMemo(() => {
    return listings.filter((l) => {
      if (!active[l.country]) return false;
      if (radius !== "all" && distanceKm(stadium, l) > radius) return false;
      return true;
    });
  }, [listings, active, radius]);

  const visibleEvents = useMemo(() => {
    if (!showEvents) return [];
    return events.filter((e) => {
      const okCountry = e.country === "all" || active[e.country as Country];
      if (!okCountry) return false;
      if (radius !== "all" && distanceKm(stadium, e) > radius) return false;
      return true;
    });
  }, [events, active, radius, showEvents]);

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
          <button
            type="button"
            onClick={() => setShowEvents((s) => !s)}
            className="map-toggle"
            data-active={showEvents}
            style={{ borderColor: "#fcf1da" }}
          >
            <span
              className="map-toggle-dot"
              style={{
                background: showEvents ? "#fcf1da" : "transparent",
                borderColor: "#fcf1da",
              }}
            />
            🏆 Events
          </button>
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

      <MapClient listings={visibleListings} events={visibleEvents} height={640} />

      <div className="eyebrow _12-below" style={{ marginTop: 16 }}>
        Showing {visibleListings.length} venues and {visibleEvents.length} events
        {radius !== "all" && ` within ${radius} km of ${STADIUM.name}`}
      </div>

      <style>{`
        .map-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
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
