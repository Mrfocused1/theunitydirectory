import Link from "next/link";

export default function Footer() {
  return (
    <section className="section">
      <div className="container">
        <div className="centre-align">
          <Link href="/" className="link-opacity _36-below w-inline-block w--current" aria-current="page">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.svg" alt="The Unity Directory" className="footer-image" />
          </Link>

          <p className="_36-below" style={{ maxWidth: 560 }}>
            A diaspora-food directory built around the four Unity Cup 2026 nations &mdash; Nigeria,
            Jamaica, Zimbabwe and India.
          </p>

          <div className="w-layout-grid grid footer">
            <div className="centre-align stack">
              <Link href="/directory" className="footer-link">Directory</Link>
              <Link href="/map" className="footer-link">Map</Link>
            </div>
            <div className="centre-align stack">
              <Link href="/enquire" className="footer-link">Enquire</Link>
            </div>
          </div>

          <div className="holder _24-below">
            <a
              href="https://instagram.com/unitycupfootball"
              target="_blank"
              rel="noreferrer"
              className="link-opacity w-inline-block"
              aria-label="Instagram"
            >
              <div className="embed w-embed">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
                </svg>
              </div>
            </a>
          </div>

          <div className="footer-link xs no-hover">
            The Unity Directory · A community project around Unity Cup 2026
          </div>
        </div>
      </div>
    </section>
  );
}
