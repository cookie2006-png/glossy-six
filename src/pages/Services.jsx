import { Link } from "react-router-dom";
import { categories } from "../data.js";

const go = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
const priceLabel = (p) => (p.startsWith("₱") ? p : "Ask for price");

export default function Services() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="text-4xl font-bold sm:text-5xl">Services</h1>
      <p className="mt-3 max-w-xl text-lg">Pick a category, choose your style, and tap Book. A "+" means the price starts at that amount. You can also request your own design.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c.id} onClick={() => go(c.id)} className="rounded-full bg-blush px-4 py-2 font-semibold hover:bg-nude">{c.title}</button>
        ))}
      </div>

      {categories.map((c, ci) => (
        <section key={c.id} id={c.id} className={`mt-12 scroll-mt-24 rounded-[2rem] p-5 sm:p-8 ${ci % 2 ? "bg-nude/40" : "bg-blush/40"}`}>
          <h2 className="text-3xl font-bold">{c.title}</h2>
          <p className="font-script text-2xl text-rose">{c.tagline}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.items.map((s) => (
              <article key={s.name} className="flex flex-col overflow-hidden rounded-3xl border border-blush bg-white shadow-sm">
                <img src={s.image} alt={`${s.name} nail example`} loading="lazy" className="aspect-square w-full object-cover" />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-bold">{s.name}</h3>
                  <p className="mt-1 flex-1">{s.desc}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-nude px-4 py-1 font-bold">{priceLabel(s.price)}</span>
                    <Link to={`/book?service=${encodeURIComponent(s.name)}`} className="btn btn-primary px-5 py-2">Book</Link>
                  </div>
                </div>
              </article>
            ))}
            {c.items.length % 3 === 2 && (
              <article className="flex flex-col justify-center rounded-3xl bg-rose p-6 text-white">
                <p className="font-script text-3xl">Have your own idea?</p>
                <p className="mt-2">You can request your own nail design. We'll do our best to make it happen!</p>
                <Link to="/contact" className="btn mt-4 self-start bg-white px-5 py-2 text-rose hover:bg-blush">Message us</Link>
              </article>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
