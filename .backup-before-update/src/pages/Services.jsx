import { Link } from "react-router-dom";
import { services } from "../data.js";

export default function Services() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="text-4xl font-bold sm:text-5xl">Services</h1>
      <p className="mt-3">Prices are a starting point. Message us for custom designs.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article key={s.name} className="flex flex-col rounded-3xl border border-blush bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">{s.name}</h2>
            <p className="mt-2 flex-1">{s.desc}</p>
            <p className="mt-4 font-medium text-rose">from {s.price}</p>
            <Link to={`/book?service=${encodeURIComponent(s.name)}`} className="btn btn-primary mt-4 text-center">
              Book
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
