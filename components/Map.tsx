"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { COUNTRIES, STADIUM, type Country, type Listing, type EventItem } from "@/lib/data";

export type MapSelection =
  | { kind: "listing"; data: Listing }
  | { kind: "event"; data: EventItem }
  | { kind: "stadium" }
  | null;

function FitBounds({
  points,
  focusStadium,
}: {
  points: { lat: number; lng: number }[];
  focusStadium: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (focusStadium) {
      map.setView([STADIUM.lat, STADIUM.lng], 14);
      return;
    }
    if (!points.length) {
      map.setView([STADIUM.lat, STADIUM.lng], 13);
      return;
    }
    const bounds = L.latLngBounds([
      [STADIUM.lat, STADIUM.lng],
      ...points.map((p) => [p.lat, p.lng] as [number, number]),
    ]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [points, focusStadium, map]);
  return null;
}

const stadiumIcon = L.divIcon({
  className: "tud-stadium-icon",
  html: `<div class="tud-stadium-inner">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c1a12" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 11h16M4 11c0-3.5 3.6-6 8-6s8 2.5 8 6"/>
      <path d="M4 11v3c0 3.5 3.6 6 8 6s8-2.5 8-6v-3"/>
      <path d="M9 11V5.5M15 11V5.5M12 11v9"/>
    </svg>
  </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

export default function Map({
  listings,
  events,
  height = 480,
  focusStadium = false,
  onSelect,
}: {
  listings: Listing[];
  events: EventItem[];
  height?: number | string;
  focusStadium?: boolean;
  onSelect?: (sel: MapSelection) => void;
}) {
  const allPoints = [
    ...listings.map((p) => ({ lat: p.lat, lng: p.lng })),
    ...events.map((p) => ({ lat: p.lat, lng: p.lng })),
  ];

  return (
    <div style={{ height, width: "100%", borderRadius: 2, overflow: "hidden", position: "relative" }}>
      <MapContainer
        center={[STADIUM.lat, STADIUM.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%", background: "#0c1a12" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds points={allPoints} focusStadium={focusStadium} />

        {/* Stadium marker */}
        <Marker
          position={[STADIUM.lat, STADIUM.lng]}
          icon={stadiumIcon}
          zIndexOffset={1000}
          eventHandlers={{ click: () => onSelect?.({ kind: "stadium" }) }}
        >
          <Tooltip permanent direction="top" offset={[0, -22]} className="tud-stadium-tooltip">
            {STADIUM.name}
          </Tooltip>
        </Marker>

        {listings.map((p) => {
          const color = COUNTRIES[p.country].color;
          return (
            <CircleMarker
              key={`l-${p.id}`}
              center={[p.lat, p.lng]}
              radius={9}
              pathOptions={{ color: "#0c1a12", weight: 2, fillColor: color, fillOpacity: 0.85 }}
              eventHandlers={{ click: () => onSelect?.({ kind: "listing", data: p }) }}
            >
              <Tooltip>{p.name}</Tooltip>
            </CircleMarker>
          );
        })}

        {events.map((p) => {
          const country = p.country === "all" ? null : (p.country as Country);
          const color = country ? COUNTRIES[country].color : "#fcf1da";
          return (
            <CircleMarker
              key={`e-${p.id}`}
              center={[p.lat, p.lng]}
              radius={11}
              pathOptions={{ color: "#0c1a12", weight: 2, fillColor: color, fillOpacity: 0.95 }}
              eventHandlers={{ click: () => onSelect?.({ kind: "event", data: p }) }}
            >
              <Tooltip>{p.title}</Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <style>{`
        .tud-stadium-icon { background: transparent !important; border: 0 !important; }
        .tud-stadium-inner {
          width: 44px; height: 44px; border-radius: 999px;
          background: #ffb81c;
          box-shadow: 0 0 0 4px rgba(255, 184, 28, 0.25), 0 6px 18px rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .tud-stadium-tooltip {
          background: #ffb81c !important;
          color: #0c1a12 !important;
          border: 0 !important;
          font-family: Stack Sans, Arial, sans-serif !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          letter-spacing: 0.5px;
          padding: 4px 10px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        .tud-stadium-tooltip::before { border-top-color: #ffb81c !important; }
        .leaflet-tooltip {
          background: #0c1a12 !important;
          color: #fcf1da !important;
          border: 1px solid rgba(252,241,218,0.25) !important;
          font-family: Stack Sans, Arial, sans-serif !important;
          font-weight: 500 !important;
          font-size: 12px !important;
          padding: 4px 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        .leaflet-tooltip-top:before { border-top-color: #0c1a12 !important; }
      `}</style>
    </div>
  );
}

// Re-export Popup so it doesn't get tree-shaken from leaflet — used elsewhere.
export { Popup };
