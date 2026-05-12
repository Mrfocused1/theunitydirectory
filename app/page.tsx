import Link from "next/link";
import MapClient from "@/components/MapClient";
import { COUNTRIES, FEATURED_LISTINGS, LISTINGS, type Country } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="section header video">
        <div className="container small z3">
          <div className="centre-align">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.svg" alt="The Unity Directory" className="site-header-image" />
            <h1 className="l-title _24-below" style={{ textAlign: "center" }}>
              Eat. Meet. Cheer them on.
            </h1>
            <p className="l-paragraph _24-below" style={{ maxWidth: 640, marginInline: "auto" }}>
              The Unity Directory maps every Nigerian, Jamaican, Zimbabwean and Indian table, bar
              and meet-up worth knowing this tournament &mdash; in London, and wider.
            </p>
            <div className="holder _12-below" style={{ justifyContent: "center" }}>
              <Link href="/directory" className="button w-inline-block">
                <div>Browse the directory</div>
              </Link>
              <Link href="/map" className="button outline w-inline-block">
                <div>Open the map</div>
              </Link>
            </div>
          </div>
        </div>
        <div className="card-gradient" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/embrace.jpg"
          alt=""
          loading="lazy"
          className="card-image"
        />
      </section>

      {/* The four nations */}
      <section className="section _0-top">
        <div className="container">
          <h1 className="l-title _48-below">Four nations. Four flavours.</h1>
          <div className="w-dyn-list">
            <div role="list" className="grid teams w-dyn-items">
              {(Object.keys(COUNTRIES) as Country[]).map((slug) => {
                const c = COUNTRIES[slug];
                const count = LISTINGS.filter((l) => l.country === slug).length;
                return (
                  <div key={slug} role="listitem" className="w-dyn-item">
                    <Link href={`/directory?country=${slug}`} className="card team w-inline-block">
                      <div className="card-inner base-align">
                        <div>
                          <div className="eyebrow">{count} places</div>
                          <div className="m-title" style={{ color: c.color }}>
                            {c.flag} {c.name}
                          </div>
                        </div>
                      </div>
                      <div className="card-gradient" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/${COUNTRY_HERO_IMG[slug]}`}
                        alt={c.name}
                        loading="lazy"
                        className="card-image"
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Map preview */}
      <section className="section _0-top">
        <div className="container">
          <div className="holder split _24-below">
            <div>
              <h2 className="eyebrow">The Map</h2>
              <div className="l-title">Hotspots &amp; meet-ups</div>
            </div>
            <Link href="/map" className="button outline w-inline-block">
              <div>Open full map</div>
            </Link>
          </div>
          <MapClient listings={LISTINGS} height={520} focusStadium />
        </div>
      </section>

      {/* Featured spots */}
      <section className="section _0-top">
        <div className="container">
          <h1 className="l-title _48-below">Featured spots</h1>
          <div role="list" className="featured-row">
            {FEATURED_LISTINGS.map((l) => (
              <div key={l.id} role="listitem">
                <Link href={`/directory/${l.id}`} className="card team _48-below w-inline-block">
                  <div className="card-inner base-align">
                    <div>
                      <div className="eyebrow" style={{ color: COUNTRIES[l.country].color, opacity: 1 }}>
                        {COUNTRIES[l.country].flag} {COUNTRIES[l.country].cuisine}
                      </div>
                      <div className="m-title">{l.name}</div>
                    </div>
                  </div>
                  <div className="card-gradient" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/${COUNTRY_HERO_IMG[l.country]}`}
                    alt={l.name}
                    loading="lazy"
                    className="card-image"
                  />
                </Link>
                <div>
                  <h2 className="m-title _12-below">{l.name}</h2>
                  <div className="balance">
                    <p className="_12-below">{l.summary}</p>
                    <div className="eyebrow _12-below">
                      {l.area} · {l.type}
                    </div>
                    <Link href={`/directory/${l.id}`} className="button outline w-button">
                      See details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="section no-padding-mobile _0-top">
        <div className="container">
          <div className="grid _0-mobile">
            <Link href="/enquire?type=feature" className="card link w-inline-block">
              <div className="card-inner">
                <div className="_48-below">
                  <div className="l-title">Run a spot?</div>
                  <div className="l-title light">Get featured.</div>
                </div>
                <div className="button"><div>Apply to be listed</div></div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/unitycupjamaica.jpg" alt="" loading="lazy" className="card-image" />
              <div className="card-gradient" />
            </Link>

            <Link href="/enquire?type=sponsor" className="card link w-inline-block">
              <div className="card-inner">
                <div className="_48-below">
                  <div className="l-title">Sponsor the directory</div>
                </div>
                <div className="button"><div>Partner with us</div></div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/8 (1).webp" alt="" loading="lazy" className="card-image" />
              <div className="card-gradient" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const COUNTRY_HERO_IMG: Record<Country, string> = {
  nigeria: "2025-05-31-Jamaica-vs-Nigeria---Unity-Cup-(Peter-Simmons)-2531.jpg",
  jamaica: "2025-05-31 Jamaica vs Nigeria - Unity Cup (Peter Simmons)-1539.jpg",
  zimbabwe: "IMG-20260331-WA0109 (1).jpg",
  india: "India National Team with Indian Flag.jpg",
};
