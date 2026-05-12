"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { COUNTRIES, type Country, type Listing, type EventItem } from "@/lib/data";

type MapPoint =
  | ({ kind: "listing" } & Listing)
  | ({ kind: "event" } & EventItem);

function FitBounds({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [points, map]);
  return null;
}

export default function Map({
  listings,
  events,
  height = 480,
}: {
  listings: Listing[];
  events: EventItem[];
  height?: number | string;
}) {
  const points: MapPoint[] = [
    ...listings.map((l) => ({ kind: "listing" as const, ...l })),
    ...events.map((e) => ({ kind: "event" as const, ...e })),
  ];

  const center: [number, number] = [51.49, -0.08];

  return (
    <div style={{ height, width: "100%", borderRadius: 2, overflow: "hidden" }}>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%", background: "#0c1a12" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds points={points} />
        {points.map((p) => {
          const country = p.kind === "listing" ? p.country : p.country === "all" ? null : (p.country as Country);
          const color = country ? COUNTRIES[country].color : "#fcf1da";
          const radius = p.kind === "event" ? 11 : 9;
          return (
            <CircleMarker
              key={`${p.kind}-${p.id}`}
              center={[p.lat, p.lng]}
              radius={radius}
              pathOptions={{
                color: "#0c1a12",
                weight: 2,
                fillColor: color,
                fillOpacity: p.kind === "event" ? 0.95 : 0.85,
              }}
            >
              <Popup>
                <div style={{ fontFamily: "DM Sans, Arial, sans-serif", color: "#0c1a12", minWidth: 200 }}>
                  <div style={{ fontFamily: "Stack Sans, Arial, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                    {p.kind === "listing" ? p.name : p.title}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                    {p.kind === "listing"
                      ? `${COUNTRIES[p.country].flag} ${COUNTRIES[p.country].cuisine} · ${p.type} · ${p.area}`
                      : `${country ? COUNTRIES[country].flag : "🏆"} ${p.type} · ${p.date} · ${p.time}`}
                  </div>
                  <div style={{ fontSize: 13 }}>{p.summary}</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
