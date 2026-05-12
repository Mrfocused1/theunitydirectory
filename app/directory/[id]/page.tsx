import { notFound } from "next/navigation";
import Link from "next/link";
import {
  LISTINGS,
  STADIUM,
  COUNTRIES,
  distanceKm,
  formatDistance,
} from "@/lib/data";
import DirectionsMenu from "@/components/DirectionsMenu";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const l = LISTINGS.find((x) => x.id === id);
  if (!l) return { title: "Not found · The Unity Directory" };
  return {
    title: `${l.name} · ${COUNTRIES[l.country].cuisine} · The Unity Directory`,
    description: l.summary,
  };
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const l = LISTINGS.find((x) => x.id === id);
  if (!l) notFound();

  const c = COUNTRIES[l.country];
  const distance = formatDistance(
    distanceKm({ lat: STADIUM.lat, lng: STADIUM.lng }, l)
  );

  return (
    <section className="section header">
      <div className="container small">
        <Link href="/directory" className="venue-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to directory
        </Link>

        <div className="venue-header" style={{ borderLeftColor: c.color }}>
          <div className="eyebrow _12-below" style={{ color: c.color, opacity: 1 }}>
            {c.flag} {c.cuisine} · {l.type}
          </div>
          <h1 className="l-title _12-below">{l.name}</h1>
          <div className="eyebrow _24-below">
            {l.area} · {distance} from the stadium
          </div>
          <p className="venue-summary _24-below">{l.summary}</p>

          <dl className="venue-grid">
            <Row label="Address" value={l.address} href={gmapsHref(l.address)} />
            {l.phone && (
              <Row
                label="Phone"
                value={l.phone}
                href={`tel:${l.phone.replace(/\s+/g, "")}`}
              />
            )}
            {l.hours && <Row label="Hours" value={l.hours} />}
            {l.url && (
              <Row
                label="Website"
                value={prettyUrl(l.url)}
                href={l.url}
                external
              />
            )}
            {l.instagram && (
              <Row
                label="Instagram"
                value={`@${l.instagram}`}
                href={`https://instagram.com/${l.instagram}`}
                external
              />
            )}
          </dl>

          {l.tags.length > 0 && (
            <div className="venue-tags">
              {l.tags.map((t) => (
                <span key={t} className="venue-tag">{t}</span>
              ))}
            </div>
          )}

          <div className="venue-actions">
            <DirectionsMenu lat={l.lat} lng={l.lng} />
            {l.url && (
              <a href={l.url} target="_blank" rel="noreferrer" className="button outline w-inline-block">
                <div>Visit website</div>
              </a>
            )}
            {l.instagram && (
              <a
                href={`https://instagram.com/${l.instagram}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${l.name} on Instagram`}
                className="venue-ig"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="venue-row">
      <dt className="eyebrow">{label}</dt>
      <dd>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="venue-link"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
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
