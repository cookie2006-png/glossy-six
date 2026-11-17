import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, services } from "../data.js";

const field = "mt-1 w-full rounded-xl border border-nude bg-white px-4 py-3";

export default function Book() {
  const [params] = useSearchParams();
  const first = params.get("service");
  const [form, setForm] = useState({
    name: "", address: "",
    service: services.some((s) => s.name === first) ? first : services[0].name,
  });
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: "loading", text: "Sending..." });
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setForm({ ...form, name: "", address: "" });
      setStatus({ type: "ok", text: "Booking received! We'll message you to confirm your slot." });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-14">
      <h1 className="text-4xl font-bold sm:text-5xl">Book a slot</h1>
      <p className="mt-3">Fill this in and we'll confirm with you.</p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl bg-blush/50 p-6 sm:p-8">
        <label className="block">Name
          <input className={field} required value={form.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label className="block">Address
          <input className={field} required value={form.address} onChange={set("address")} autoComplete="street-address" />
        </label>
        <label className="block">Name of service
          <select className={field} value={form.service} onChange={set("service")}>
            {categories.map((c) => <optgroup key={c.title} label={c.title}>{c.items.map((s) => <option key={s.name}>{s.name}</option>)}</optgroup>)}
          </select>
        </label>
        <button className="btn btn-primary w-full disabled:opacity-60" disabled={status.type === "loading"}>
          Send booking
        </button>
        {status.text && <p role="status" className={status.type === "error" ? "text-red-700" : ""}>{status.text}</p>}
      </form>
    </div>
  );
}
