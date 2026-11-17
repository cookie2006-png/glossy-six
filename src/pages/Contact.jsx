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
    <div className="mx-auto grid max-w-5xl gap-8 px-5 py-14 md:grid-cols-2">
      {/* Left: details + map (the map grows so both columns end at the same line) */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold sm:text-5xl">Contact</h1>
        <p className="mt-3 max-w-sm text-lg">Tell us the design you want and when you're free. We'll confirm your slot.</p>
        <dl className="mt-6 space-y-4">
          <div>
            <dt className="font-script text-2xl text-rose">Email</dt>
            <dd><a className="underline" href={`mailto:${business.email}`}>{business.email}</a></dd>
          </div>
          <div>
            <dt className="font-script text-2xl text-rose">Location</dt>
            <dd>{business.address}</dd>
          </div>
          <div>
            <dt className="font-script text-2xl text-rose">Find us on</dt>
            <dd className="flex gap-4">
              {business.socials.map((s) => (
                <a key={s.label} href={s.href} className="underline" target="_blank" rel="noreferrer">{s.label}</a>
              ))}
            </dd>
          </div>
        </dl>
        <div className="relative mt-6 min-h-[16rem] flex-1 overflow-hidden rounded-3xl bg-nude/60">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="font-script text-3xl text-rose">Find us here</p>
            <p className="mt-1">{business.address}</p>
            <a className="btn btn-primary mt-4 px-5 py-2" target="_blank" rel="noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapQuery)}`}>Open in Google Maps</a>
          </div>
          <iframe
            title="Map of our location"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&output=embed`}
          />
        </div>
      </div>

      {/* Right: form fills the space, plus a home service card */}
      <div className="flex flex-col gap-6">
        <form onSubmit={submit} className="flex flex-1 flex-col gap-4 rounded-3xl bg-blush/50 p-6 sm:p-8">
          <label className="block">Name
            <input className={field} required value={form.name} onChange={set("name")} autoComplete="name" />
          </label>
          <label className="block">Email
            <input className={field} type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
          </label>
          <label className="flex flex-1 flex-col">Message
            <textarea className={`${field} min-h-[8rem] flex-1`} required value={form.message} onChange={set("message")} />
          </label>
          <button className="btn btn-primary w-full disabled:opacity-60" disabled={status.type === "loading"}>
            Send message
          </button>
          {status.text && <p role="status" className={status.type === "error" ? "text-red-700" : ""}>{status.text}</p>}
        </form>
        <div className="rounded-3xl bg-rose p-6 text-white">
          <p className="font-script text-3xl">Home service available</p>
          <p className="mt-1">We bring your nail glow to you! Message us to book your appointment.</p>
        </div>
      </div>
    </div>
  );
}
