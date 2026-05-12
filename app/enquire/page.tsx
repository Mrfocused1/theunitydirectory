import EnquireClient from "./EnquireClient";

export const metadata = { title: "Enquire · The Unity Directory" };

export default function EnquirePage() {
  return (
    <>
      <section className="section header">
        <div className="container small">
          <h1 className="l-title _24-below">Get in touch</h1>
          <p className="l-paragraph _36-below" style={{ maxWidth: 720 }}>
            General questions, sponsorship enquiries, or want your spot featured in the directory?
            Pick a reason below and we&rsquo;ll reply within one working day.
          </p>
          <EnquireClient />
        </div>
      </section>
    </>
  );
}
