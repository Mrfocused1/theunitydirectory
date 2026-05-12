import MapPageClient from "./MapPageClient";
import { LISTINGS, COUNTRIES } from "@/lib/data";

export const metadata = { title: "Map · The Unity Directory" };

export default function MapPage() {
  return (
    <>
      <section className="section header _0-top" style={{ paddingTop: 144 }}>
        <div className="container">
          <h1 className="l-title _24-below">The Map</h1>
          <p className="l-paragraph _36-below" style={{ maxWidth: 720 }}>
            Every place on the directory, plotted. Filter by cuisine and radius from the stadium,
            then tap a marker for full details.
          </p>
          <MapPageClient listings={LISTINGS} countries={COUNTRIES} />
        </div>
      </section>
    </>
  );
}
