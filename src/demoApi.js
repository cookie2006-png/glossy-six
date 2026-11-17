// DEMO MODE: a tiny fake server that runs inside the browser and saves to localStorage.
// It lets the site (bookings, reviews, admin) work on a static host like Vercel with no backend.
// Turned on by the VITE_DEMO=true build setting. The real server is server/index.js.
const KEY = "gs_demo_db_v1";
const iso = () => new Date().toISOString();

const seed = () => {
  const d = iso(), day = d.slice(0, 10);
  const b = (id, name, address, service, type, status) => ({ id, createdAt: d, name, address, service, type, status, date: day });
  return {
    n: 10,
    bookings: [
      b("b1", "Ana Reyes", "San Agustin", "Classic French", "appointment", "pending"),
      b("b2", "Bea Cruz", "Dolores", "Detailed Art", "appointment", "confirmed"),
      b("b3", "Cathy Lim", "Telabastagan", "Natural / Plain", "walk-in", "done"),
      b("b4", "Dana Ruiz", "Sindalan", "Builder Gel (With Color)", "walk-in", "done"),
    ],
    receipts: [{ id: "r1", no: "GS-0001", createdAt: d, clientName: "Cathy Lim", service: "Natural / Plain", amount: 350, method: "Cash", notes: "", date: day, bookingId: "b3" }],
    reviews: [],
  };
};

let db = null;
try { db = JSON.parse(localStorage.getItem(KEY)); } catch { db = null; }
if (!db || !db.bookings) db = seed();
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* ignore */ } };

const reply = (data, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }));
const s = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const uid = () => `id${(db.n++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const valid = {
  bookings: (b) => s(b.name, 100) && s(b.service, 100),
  receipts: (b) => s(b.clientName, 100) && s(b.service, 100) && Number.isFinite(Number(b.amount)) && Number(b.amount) >= 0,
  reviews: (b) => s(b.name, 60) && s(b.comment, 500) && Number(b.rating) >= 1 && Number(b.rating) <= 5,
};

export function installDemoApi() {
  const real = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    if (!url.startsWith("/api/")) return real(input, init);
    const method = (init.method || "GET").toUpperCase();
    let body = {};
    try { body = init.body ? JSON.parse(init.body) : {}; } catch { body = {}; }
    const authed = ((init.headers || {}).Authorization || "") === "Bearer demo-token";

    // ---- public ----
    if (url === "/api/contact") {
      return s(body.name, 100) && /^\S+@\S+\.\S+$/.test(s(body.email, 200)) && s(body.message, 2000)
        ? reply({ ok: true }) : reply({ error: "Please fill in your name, a valid email, and a message." }, 400);
    }
    if (url === "/api/book") {
      if (!s(body.name, 100) || !s(body.address, 300) || !s(body.service, 100)) return reply({ error: "Please fill in your name, address and service." }, 400);
      db.bookings.push({ id: uid(), createdAt: iso(), type: "appointment", status: "pending", date: "", name: s(body.name, 100), address: s(body.address, 300), service: s(body.service, 100) });
      persist(); return reply({ ok: true });
    }
    if (url === "/api/reviews") {
      if (method === "GET") return reply(db.reviews.filter((r) => r.status === "approved"));
      if (!valid.reviews(body)) return reply({ error: "Please add your name, a rating from 1 to 5, and a comment." }, 400);
      db.reviews.push({ id: uid(), createdAt: iso(), name: s(body.name, 60), rating: Math.round(Number(body.rating)), comment: s(body.comment, 500), status: "pending" });
      persist(); return reply({ ok: true });
    }

    // ---- admin ----
    if (url === "/api/admin/login") {
      return body.username === "admin" && body.password === "glossy2026"
        ? reply({ token: "demo-token" }) : reply({ error: "Wrong username or password." }, 401);
    }
    const m = url.match(/^\/api\/admin\/(bookings|receipts|reviews)(?:\/(.+))?$/);
    if (!m) return reply({ error: "Not found." }, 404);
    if (!authed) return reply({ error: "Please log in." }, 401);
    const [, col, id] = m, list = db[col];
    if (method === "GET") return reply(list);
    if (method === "DELETE") { db[col] = list.filter((x) => x.id !== id); persist(); return reply({ ok: true }); }
    if (!valid[col](body)) return reply({ error: "Please fill in the required fields." }, 400);
    if (method === "POST") {
      const item = { ...body, id: uid(), createdAt: iso() };
      if (col === "receipts") item.no = "GS-" + String(list.reduce((mx, r) => Math.max(mx, parseInt(String(r.no).slice(3)) || 0), 0) + 1).padStart(4, "0");
      list.push(item); persist(); return reply(item);
    }
    const i = list.findIndex((x) => x.id === id);
    if (i < 0) return reply({ error: "Not found." }, 404);
    list[i] = { ...list[i], ...body, id: list[i].id }; persist(); return reply(list[i]);
  };
}
