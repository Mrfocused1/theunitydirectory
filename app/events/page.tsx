import { EVENTS, COUNTRIES } from "@/lib/data";

export const metadata = { title: "Events · The Unity Directory" };

export default function EventsPage() {
  const sorted = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <section className="section header">
        <div className="container">
          <h1 className="l-title _24-below">Events &amp; meet-ups</h1>
          <p className="l-paragraph" style={{ maxWidth: 720 }}>
            Watch parties, supper clubs, pop-ups and five-a-sides. Drop in, or sign up via the
            enquiry form to host your own.
          </p>
        </div>
      </section>

      <section className="section _0-top">
        <div className="container">
          <div className="events-list">
            {sorted.map((e) => {
              const c = e.country === "all" ? null : COUNTRIES[e.country];
              return (
                <article key={e.id} className="event-row">
                  <div className="event-when">
                    <div className="bold">{e.date}</div>
                    <div className="eyebrow" style={{ marginTop: 4 }}>{e.time}</div>
                  </div>
                  <div className="event-body">
                    <div className="eyebrow _12-below" style={c ? { color: c.color, opacity: 1 } : undefined}>
                      {c ? `${c.flag} ${c.name}` : "🏆 All nations"} · {e.type}
                    </div>
                    <h2 className="m-title _12-below">{e.title}</h2>
                    <p className="_12-below">{e.summary}</p>
                    <div className="eyebrow">{e.venue} · {e.area}</div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .events-list { display: flex; flex-direction: column; gap: 24px; }
        .event-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(252,241,218,0.15);
        }
        .event-when { padding-top: 8px; }
        @media (max-width: 767px) {
          .event-row { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>
    </>
  );
}
