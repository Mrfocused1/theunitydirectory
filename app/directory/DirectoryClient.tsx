"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { type Country, type Listing, COUNTRIES } from "@/lib/data";

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

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (country !== "all" && l.country !== country) return false;
      if (type !== "all" && l.type !== type) return false;
      if (area !== "all" && l.area !== area) return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        const hay = `${l.name} ${l.summary} ${l.tags.join(" ")} ${l.area}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [listings, country, type, area, q]);

  return (
    <>
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
      </div>

      <div className="directory-grid">
        {filtered.map((l) => {
          const c = COUNTRIES[l.country];
          return (
            <article key={l.id} id={l.id} className="directory-card">
              <div
                className="directory-card-stripe"
                style={{ background: c.color }}
                aria-hidden
              />
              <div className="directory-card-body">
                <div className="eyebrow" style={{ color: c.color, opacity: 1, marginBottom: 8 }}>
                  {c.flag} {c.cuisine} · {l.type}
                </div>
                <h2 className="m-title _12-below">{l.name}</h2>
                <p className="_12-below">{l.summary}</p>
                <div className="eyebrow _12-below">
                  {l.area} · {l.priceRange}
                </div>
                <div className="directory-tags _12-below">
                  {l.tags.map((t) => (
                    <span key={t} className="directory-tag">
                      {t}
                    </span>
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
          No places match your filters. Try widening them.
        </div>
      )}

      <style>{`
        .directory-filters {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 767px) {
          .directory-filters { grid-template-columns: 1fr 1fr; }
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
