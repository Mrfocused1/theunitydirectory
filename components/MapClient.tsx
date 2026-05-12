"use client";
import dynamic from "next/dynamic";
import type { Listing, EventItem } from "@/lib/data";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 480,
        width: "100%",
        background: "#0a1410",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--_colours---light)",
        fontFamily: "Stack Sans, Arial, sans-serif",
        opacity: 0.6,
      }}
    >
      Loading map…
    </div>
  ),
});

export default function MapClient(props: {
  listings: Listing[];
  events: EventItem[];
  height?: number | string;
}) {
  return <Map {...props} />;
}
