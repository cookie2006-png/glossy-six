import { useState } from "react";
import { business } from "../data.js";

const field = "mt-1 w-full rounded-xl border border-nude bg-white px-4 py-3";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: "loading", text: "Sending..." });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setForm({ name: "", email: "", message: "" });
      setStatus({ type: "ok", text: "Message sent! We'll reply soon." });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-14 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold">Contact</h1>
        <p className="mt-3 max-w-sm">Tell us the design you want and when you're free. We'll confirm your slot.</p>
        <dl className="mt-8 space-y-5">
          <div>
            <dt className="font-display text-lg italic text-rose">Email</dt>
            <dd><a className="underline" href={`mailto:${business.email}`}>{business.email}</a></dd>
          </div>
          <div>
            <dt className="font-display text-lg italic text-rose">Location</dt>
            <dd>{business.address}</dd>
          </div>
          <div>
            <dt className="font-display text-lg italic text-rose">Find us on</dt>
            <dd className="flex gap-4">
              {business.socials.map((s) => (
                <a key={s.label} href={s.href} className="underline" target="_blank" rel="noreferrer">{s.label}</a>
              ))}
            </dd>
          </div>
        </dl>
        <iframe
          title="Map of our location"
          className="mt-8 h-64 w-full rounded-3xl border-0"
          loading="lazy"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&output=embed`}
        />
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-blush/50 p-6 sm:p-8">
        <label className="block">Name
          <input className={field} required value={form.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label className="block">Email
          <input className={field} type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
        </label>
        <label className="block">Message
          <textarea className={field} rows="4" required value={form.message} onChange={set("message")} />
        </label>
        <button className="btn btn-primary w-full disabled:opacity-60" disabled={status.type === "loading"}>
          Send message
        </button>
        {status.text && (
          <p role="status" className={status.type === "error" ? "text-red-700" : ""}>{status.text}</p>
        )}
      </form>
    </div>
  );
}
