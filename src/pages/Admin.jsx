import { useCallback, useEffect, useMemo, useState } from "react";
import { business, categories, services } from "../data.js";

const KEY = "gs_admin_token";
const getTok = () => { try { return sessionStorage.getItem(KEY) || ""; } catch { return ""; } };
const setTok = (t) => { try { t ? sessionStorage.setItem(KEY, t) : sessionStorage.removeItem(KEY); } catch { /* ignore */ } };
const peso = (n) => `₱${Number(n || 0).toLocaleString()}`;
const priceOf = (name) => Number(((services.find((s) => s.name === name) || {}).price || "").replace(/[^\d.]/g, "")) || 0;
const today = () => new Date().toISOString().slice(0, 10);
const field = "mt-1 w-full rounded-xl border border-nude bg-white px-3 py-2";
const small = "rounded-full bg-blush px-3 py-1 text-sm hover:bg-nude";
const statuses = ["pending", "confirmed", "done", "cancelled"];

// Grouped service dropdown; keeps an older/unknown service name selectable
const Options = ({ extra }) => (
  <>
    {categories.map((c) => <optgroup key={c.title} label={c.title}>{c.items.map((s) => <option key={s.name}>{s.name}</option>)}</optgroup>)}
    {extra && !services.some((s) => s.name === extra) && <option>{extra}</option>}
  </>
);

function Modal({ children, onClose, error }) {
  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-berry/40 p-4" onClick={onClose}>
      <div className="mx-auto my-6 w-full max-w-md rounded-3xl bg-petal p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {error && <p className="mb-3 text-red-700">{error}</p>}
        {children}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [f, setF] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Login failed.");
      onLogin(d.token);
    } catch (x) { setErr(x.message); }
  }
  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="text-3xl font-bold">Admin login</h1>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-3xl bg-blush/50 p-6">
        <label className="block">Username
          <input className={field} value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} autoComplete="username" required />
        </label>
        <label className="block">Password
          <input className={field} type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" required />
        </label>
        {import.meta.env.VITE_DEMO === "true" && <p className="text-sm">Demo login: <b>admin</b> / <b>glossy2026</b></p>}
        <button className="btn btn-primary w-full">Log in</button>
        {err && <p role="alert" className="text-red-700">{err}</p>}
      </form>
    </div>
  );
}

function BookingForm({ initial, onSave, onClose }) {
  const [f, setF] = useState({ name: "", address: "", service: services[0].name, type: "walk-in", status: "confirmed", date: today(), ...initial });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f); }} className="space-y-3">
      <h2 className="text-2xl font-bold">{initial.id ? "Edit booking" : "Add booking"}</h2>
      <label className="block">Name<input className={field} required value={f.name} onChange={set("name")} /></label>
      <label className="block">Address<input className={field} value={f.address} onChange={set("address")} /></label>
      <label className="block">Service
        <select className={field} value={f.service} onChange={set("service")}><Options /></select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">Type
          <select className={field} value={f.type} onChange={set("type")}><option value="walk-in">walk-in</option><option value="appointment">appointment</option></select>
        </label>
        <label className="block">Status
          <select className={field} value={f.status} onChange={set("status")}>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
        </label>
      </div>
      <label className="block">Date<input className={field} type="date" value={f.date} onChange={set("date")} /></label>
      <div className="flex gap-2 pt-2"><button className="btn btn-primary">Save</button><button type="button" className="btn btn-soft" onClick={onClose}>Cancel</button></div>
    </form>
  );
}

function ReceiptForm({ initial, onSave, onClose }) {
  const [f, setF] = useState({ bookingId: "", clientName: "", service: services[0].name, amount: priceOf(services[0].name), method: "Cash", notes: "", date: today(), ...initial });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...f, amount: Number(f.amount) }); }} className="space-y-3">
      <h2 className="text-2xl font-bold">{initial.id ? "Edit receipt" : "New receipt"}</h2>
      <label className="block">Client name<input className={field} required value={f.clientName} onChange={set("clientName")} /></label>
      <label className="block">Service
        <select className={field} value={f.service} onChange={(e) => setF({ ...f, service: e.target.value, amount: initial.id ? f.amount : priceOf(e.target.value) })}>
          <Options extra={f.service} />
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">Amount (₱)<input className={field} type="number" min="0" step="any" required value={f.amount} onChange={set("amount")} /></label>
        <label className="block">Payment
          <select className={field} value={f.method} onChange={set("method")}><option>Cash</option><option>GCash</option><option>Other</option></select>
        </label>
      </div>
      <label className="block">Date<input className={field} type="date" value={f.date} onChange={set("date")} /></label>
      <label className="block">Notes<input className={field} value={f.notes} onChange={set("notes")} /></label>
      <div className="flex gap-2 pt-2"><button className="btn btn-primary">Save</button><button type="button" className="btn btn-soft" onClick={onClose}>Cancel</button></div>
    </form>
  );
}

function ReviewForm({ initial, onSave, onClose }) {
  const [f, setF] = useState({ name: "", rating: 5, comment: "", status: "approved", ...initial });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...f, rating: Number(f.rating) }); }} className="space-y-3">
      <h2 className="text-2xl font-bold">{initial.id ? "Edit review" : "Add review"}</h2>
      <label className="block">Customer name<input className={field} required value={f.name} onChange={set("name")} /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">Rating
          <select className={field} value={f.rating} onChange={set("rating")}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
        </label>
        <label className="block">Status
          <select className={field} value={f.status} onChange={set("status")}>{["pending", "approved", "hidden"].map((x) => <option key={x}>{x}</option>)}</select>
        </label>
      </div>
      <label className="block">Review<textarea className={field} rows="4" required maxLength={500} value={f.comment} onChange={set("comment")} /></label>
      <div className="flex gap-2 pt-2"><button className="btn btn-primary">Save</button><button type="button" className="btn btn-soft" onClick={onClose}>Cancel</button></div>
    </form>
  );
}

function ReceiptView({ r, onClose }) {
  return (
    <>
      <div className="print-area text-center">
        <p className="font-display text-2xl font-bold italic text-rose">{business.name}</p>
        <p className="text-sm">{business.address}</p>
        <p className="text-sm">{business.email}</p>
        <hr className="my-4 border-nude" />
        <p className="font-bold">Receipt {r.no}</p>
        <p className="text-sm">{r.date || (r.createdAt || "").slice(0, 10)}</p>
        <dl className="mt-4 space-y-1 text-left">
          <div className="flex justify-between"><dt>Client</dt><dd>{r.clientName}</dd></div>
          <div className="flex justify-between"><dt>Service</dt><dd>{r.service}</dd></div>
          <div className="flex justify-between"><dt>Payment</dt><dd>{r.method}</dd></div>
          {r.notes && <div className="flex justify-between"><dt>Notes</dt><dd>{r.notes}</dd></div>}
          <div className="flex justify-between border-t border-nude pt-2 text-lg font-bold"><dt>Total</dt><dd>{peso(r.amount)}</dd></div>
        </dl>
        <p className="mt-5 font-display italic">Thank you! See you again.</p>
      </div>
      <div className="mt-5 flex gap-2"><button className="btn btn-primary" onClick={() => window.print()}>Print</button><button className="btn btn-soft" onClick={onClose}>Close</button></div>
    </>
  );
}

export default function Admin() {
  const [token, setToken] = useState(getTok());
  const [tab, setTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");

  const call = useCallback(async (method, url, body) => {
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) { setTok(""); setToken(""); }
    if (!r.ok) throw new Error(d.error || "Something went wrong.");
    return d;
  }, [token]);

  const load = useCallback(async () => {
    try {
      const [b, r, v] = await Promise.all([call("GET", "/api/admin/bookings"), call("GET", "/api/admin/receipts"), call("GET", "/api/admin/reviews")]);
      setBookings(b); setReceipts(r); setReviews(v); setError("");
    } catch (e) { setError(e.message); }
  }, [call]);
  useEffect(() => { if (token) load(); }, [token, load]);

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "cancelled");
    const per = {};
    services.forEach((s) => { per[s.name] = 0; });
    active.forEach((b) => { per[b.service] = (per[b.service] || 0) + 1; });
    return {
      walkIn: active.filter((b) => b.type === "walk-in").length,
      appt: active.filter((b) => b.type === "appointment").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      revenue: receipts.reduce((s, r) => s + Number(r.amount || 0), 0),
      per,
    };
  }, [bookings, receipts]);

  if (!token) return <Login onLogin={(t) => { setTok(t); setToken(t); }} />;

  const run = async (fn) => { try { await fn(); setModal(null); setError(""); } catch (e) { setError(e.message); } };
  const url = (col, id) => `/api/admin/${col}${id ? `/${id}` : ""}`;
  const saveBooking = (data) => run(async () => { await call(data.id ? "PUT" : "POST", url("bookings", data.id), data); await load(); });
  const saveReceipt = (data) => run(async () => {
    await call(data.id ? "PUT" : "POST", url("receipts", data.id), data);
    const b = bookings.find((x) => x.id === data.bookingId);
    if (!data.id && b && b.status !== "done") await call("PUT", url("bookings", b.id), { ...b, status: "done" });
    await load();
  });
  const remove = (col, id) => { if (window.confirm("Delete this? This cannot be undone.")) run(async () => { await call("DELETE", url(col, id)); await load(); }); };
  const setStatus = (b, status) => run(async () => { await call("PUT", url("bookings", b.id), { ...b, status }); await load(); });
  const logout = () => { setTok(""); setToken(""); };
  const saveReview = (data) => run(async () => { await call(data.id ? "PUT" : "POST", url("reviews", data.id), data); await load(); });
  const setReviewStatus = (r, status) => run(async () => { await call("PUT", url("reviews", r.id), { ...r, status }); await load(); });

  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
  const max = Math.max(1, ...Object.values(stats.per));
  const tiles = [["Walk-in", stats.walkIn], ["Appointments", stats.appt], ["Pending", stats.pending], ["Revenue", peso(stats.revenue)]];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Admin</h1>
        <nav className="flex flex-wrap gap-2" aria-label="Admin">
          {["dashboard", "bookings", "receipts", "reviews"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 capitalize ${tab === t ? "bg-rose text-white" : "bg-blush"}`}>{t === "reviews" && pendingReviews ? `reviews (${pendingReviews} new)` : t}</button>
          ))}
          <button onClick={logout} className="rounded-full px-4 py-2 underline">Log out</button>
        </nav>
      </div>
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}

      {tab === "dashboard" && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {tiles.map(([l, v]) => (
              <div key={l} className="rounded-3xl bg-blush/60 p-5"><p className="text-sm">{l}</p><p className="font-display text-3xl font-bold">{v}</p></div>
            ))}
          </div>
          <h2 className="mt-10 text-2xl font-bold">Bookings per service</h2>
          {[...categories.map((c) => [c.title, c.items.map((x) => x.name)]), ["Other / older services", Object.keys(stats.per).filter((n) => !services.some((x) => x.name === n))]]
            .filter(([, names]) => names.length)
            .map(([title, names]) => (
              <div key={title} className="mt-6">
                <h3 className="font-display text-lg font-bold text-rose">{title}</h3>
                <ul className="mt-2 space-y-3">
                  {names.map((name) => (
                    <li key={name}>
                      <div className="flex justify-between"><span>{name}</span><span className="font-bold">{stats.per[name] || 0}</span></div>
                      <div className="mt-1 h-3 rounded-full bg-nude/60"><div className="h-3 rounded-full bg-rose" style={{ width: `${((stats.per[name] || 0) / max) * 100}%` }} /></div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          <p className="mt-6 text-sm">Cancelled bookings are not counted. Revenue is the total of all receipts ({receipts.length}).</p>
        </>
      )}

      {tab === "bookings" && (
        <>
          <button className="btn btn-primary mt-6" onClick={() => setModal({ kind: "booking", item: {} })}>Add booking / walk-in</button>
          <div className="mt-4 divide-y divide-blush rounded-3xl bg-white">
            {bookings.length === 0 && <p className="p-5">No bookings yet.</p>}
            {[...bookings].reverse().map((b) => (
              <div key={b.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-[10rem] flex-1">
                  <p className="font-bold">{b.name}</p>
                  <p className="text-sm">{b.address || "No address"}</p>
                  <p className="text-sm">{b.service} · {b.date || (b.createdAt || "").slice(0, 10)}</p>
                </div>
                <span className="rounded-full bg-nude px-3 py-1 text-sm">{b.type}</span>
                <select aria-label="Status" className="rounded-xl border border-nude bg-white px-2 py-1" value={b.status} onChange={(e) => setStatus(b, e.target.value)}>
                  {statuses.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className={small} onClick={() => setModal({ kind: "receipt", item: { bookingId: b.id, clientName: b.name, service: b.service, amount: priceOf(b.service) } })}>Receipt</button>
                <button className={small} onClick={() => setModal({ kind: "booking", item: b })}>Edit</button>
                <button className={small} onClick={() => remove("bookings", b.id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "receipts" && (
        <>
          <button className="btn btn-primary mt-6" onClick={() => setModal({ kind: "receipt", item: {} })}>New receipt</button>
          <div className="mt-4 divide-y divide-blush rounded-3xl bg-white">
            {receipts.length === 0 && <p className="p-5">No receipts yet.</p>}
            {[...receipts].reverse().map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-[10rem] flex-1">
                  <p className="font-bold">{r.no} · {r.clientName}</p>
                  <p className="text-sm">{r.service} · {r.method} · {r.date || (r.createdAt || "").slice(0, 10)}</p>
                </div>
                <p className="font-display text-lg font-bold">{peso(r.amount)}</p>
                <button className={small} onClick={() => setModal({ kind: "view", item: r })}>View / Print</button>
                <button className={small} onClick={() => setModal({ kind: "receipt", item: r })}>Edit</button>
                <button className={small} onClick={() => remove("receipts", r.id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "reviews" && (
        <>
          <button className="btn btn-primary mt-6" onClick={() => setModal({ kind: "review", item: {} })}>Add review</button>
          <p className="mt-3 text-sm">New customer reviews start as "pending". Set one to "approved" to show it on the About page. "hidden" removes it from the page without deleting it.</p>
          <div className="mt-4 divide-y divide-blush rounded-3xl bg-white">
            {reviews.length === 0 && <p className="p-5">No reviews yet.</p>}
            {[...reviews].reverse().map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-[10rem] flex-1">
                  <p className="font-bold">{r.name} <span className="text-gold" aria-label={`${r.rating} stars`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></p>
                  <p className="text-sm">{r.comment}</p>
                </div>
                <select aria-label="Review status" className="rounded-xl border border-nude bg-white px-2 py-1" value={r.status} onChange={(e) => setReviewStatus(r, e.target.value)}>
                  {["pending", "approved", "hidden"].map((x) => <option key={x}>{x}</option>)}
                </select>
                <button className={small} onClick={() => setModal({ kind: "review", item: r })}>Edit</button>
                <button className={small} onClick={() => remove("reviews", r.id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {modal && (
        <Modal onClose={() => setModal(null)} error={error}>
          {modal.kind === "booking" && <BookingForm initial={modal.item} onSave={saveBooking} onClose={() => setModal(null)} />}
          {modal.kind === "receipt" && <ReceiptForm initial={modal.item} onSave={saveReceipt} onClose={() => setModal(null)} />}
          {modal.kind === "review" && <ReviewForm initial={modal.item} onSave={saveReview} onClose={() => setModal(null)} />}
          {modal.kind === "view" && <ReceiptView r={modal.item} onClose={() => setModal(null)} />}
        </Modal>
      )}
    </div>
  );
}
