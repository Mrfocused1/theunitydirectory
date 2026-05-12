import MapPageClient from "./MapPageClient";
import { LISTINGS, EVENTS, COUNTRIES } from "@/lib/data";

export const metadata = { title: "Map · The Unity Directory" };

export default function MapPage() {
  return (
    <>
      <section className="section header _0-top" style={{ paddingTop: 144 }}>
        <div className="container">
          <h1 className="l-title _24-below">The Map</h1>
          <p className="l-paragraph _36-below" style={{ maxWidth: 720 }}>
            Every place and event on the directory, plotted. Filled circles are venues. Larger
            outlined circles are upcoming meet-ups and watch parties.
          </p>
          <MapPageClient listings={LISTINGS} events={EVENTS} countries={COUNTRIES} />
        </div>
      </section>
    </>
  );
}
