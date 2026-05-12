import DirectoryClient from "./DirectoryClient";
import { LISTINGS, ALL_AREAS, COUNTRIES } from "@/lib/data";

export const metadata = { title: "Directory · The Unity Directory" };

export default function DirectoryPage() {
  return (
    <>
      <section className="section header">
        <div className="container">
          <h1 className="l-title _24-below">The Directory</h1>
          <p className="l-paragraph" style={{ maxWidth: 720 }}>
            {LISTINGS.length} places across four nations. Filter by country, type or area &mdash;
            then point yourself at the next plate.
          </p>
        </div>
      </section>

      <section className="section _0-top">
        <div className="container">
          <DirectoryClient listings={LISTINGS} areas={ALL_AREAS} countries={COUNTRIES} />
        </div>
      </section>
    </>
  );
}
