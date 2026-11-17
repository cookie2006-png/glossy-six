import { useEffect, useState } from "react";
import { sampleReviews } from "../data.js";

const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
const field = "mt-1 w-full rounded-xl border border-nude bg-white px-4 py-3";

export default function Reviews() {
  const [list, setList] = useState(null); // null = still loading
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [status, setStatus] = useState({ type: "idle", text: "" });

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
      .catch(() => setList([]));
  }, []);

  const real = (list || []).slice(-6).reverse();
  // Keep at least 4 cards so there is never an empty gap beside the form
  const shown = list === null ? [] : [...real, ...sampleReviews.slice(0, Math.max(0, 4 - real.length))];
  const avg = list && list.length ? (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1) : null;

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: "loading", text: "Sending..." });
    try {
      const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setForm({ name: "", rating: 5, comment: "" });
      setStatus({ type: "ok", text: "Thank you! Your review will show here once we approve it." });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h2 className="text-3xl font-bold sm:text-4xl">What our customers say</h2>
      <p className="font-script text-2xl text-rose">
        {avg ? `${avg} out of 5, from ${list.length} review${list.length > 1 ? "s" : ""}` : "Be the first to leave a review!"}
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[3fr_2fr]">
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          {list === null && <p>Loading reviews...</p>}
          {shown.map((r) => (
            <figure key={r.id} className="flex flex-col justify-between rounded-3xl border border-blush bg-white p-5 shadow-sm">
              <p className="text-lg text-gold" role="img" aria-label={`${r.rating} out of 5 stars`}>{stars(r.rating)}</p>
              <blockquote className="mt-2 font-display italic">“{r.comment}”</blockquote>
              <figcaption className="mt-3 font-bold">{r.name}{r.sample && <span className="ml-2 text-xs font-normal opacity-70">sample review</span>}</figcaption>
            </figure>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4 rounded-3xl bg-blush/50 p-6">
          <h3 className="text-xl font-bold">Leave a review</h3>
          <label className="block">Your name
            <input className={field} required maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <fieldset>
            <legend>Your rating</legend>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-pressed={form.rating === n}
                  onClick={() => setForm({ ...form, rating: n })}
                  className={`text-3xl leading-none ${n <= form.rating ? "text-gold" : "text-nude"}`}>★</button>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-1 flex-col">Your review
            <textarea className={`${field} min-h-[6rem] flex-1`} required maxLength={500} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          </label>
          <button className="btn btn-primary w-full disabled:opacity-60" disabled={status.type === "loading"}>Send review</button>
          {status.text && <p role="status" className={status.type === "error" ? "text-red-700" : ""}>{status.text}</p>}
        </form>
      </div>
    </section>
  );
}
