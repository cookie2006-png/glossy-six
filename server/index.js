import express from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ---- Admin login (CHANGE THESE: set ADMIN_USER / ADMIN_PASS / SECRET environment variables) ----
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "glossy2026";
const SECRET = process.env.SECRET || crypto.randomBytes(32).toString("hex");
if (!process.env.ADMIN_PASS) console.warn("WARNING: using the default admin password. Set ADMIN_PASS before going online.");

const h = (s) => crypto.createHash("sha256").update(String(s)).digest();
const same = (a, b) => crypto.timingSafeEqual(h(a), h(b));
const sign = (p) => crypto.createHmac("sha256", SECRET).update(p).digest("hex");
const makeToken = () => { const p = String(Date.now() + 8 * 3600e3); return `${p}.${sign(p)}`; };
const validToken = (t) => {
  const [p, s] = String(t || "").split(".");
  if (!p || !s) return false;
  const e = sign(p);
  return s.length === e.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(e)) && Number(p) > Date.now();
};
const auth = (req, res, next) =>
  validToken((req.headers.authorization || "").replace("Bearer ", "")) ? next() : res.status(401).json({ error: "Please log in." });

// ---- Tiny JSON "database" ----
const DB = path.join(__dirname, "data.json");
const read = () => ({ bookings: [], receipts: [], reviews: [], ...(fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, "utf8")) : {}) });
const write = (d) => fs.writeFileSync(DB, JSON.stringify(d, null, 2));

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = (v, list, d) => (list.includes(v) ? v : d);
const cleanBooking = (b = {}) => {
  const v = {
    name: str(b.name, 100), address: str(b.address, 300), service: str(b.service, 100),
    type: oneOf(b.type, ["walk-in", "appointment"], "walk-in"),
    status: oneOf(b.status, ["pending", "confirmed", "done", "cancelled"], "pending"),
    date: str(b.date, 10),
  };
  return !v.name || !v.service ? { error: "Name and service are required." } : v;
};
const cleanReceipt = (b = {}) => {
  const v = {
    bookingId: str(b.bookingId, 60), clientName: str(b.clientName, 100), service: str(b.service, 100),
    amount: Number(b.amount), method: oneOf(b.method, ["Cash", "GCash", "Other"], "Cash"),
    notes: str(b.notes, 300), date: str(b.date, 10),
  };
  return !v.clientName || !v.service || !Number.isFinite(v.amount) || v.amount < 0
    ? { error: "Client name, service and a valid amount are required." } : v;
};

const cleanReview = (b = {}) => {
  const v = {
    name: str(b.name, 60), rating: Math.round(Number(b.rating)), comment: str(b.comment, 500),
    status: oneOf(b.status, ["pending", "approved", "hidden"], "pending"),
  };
  return !v.name || !v.comment || !(v.rating >= 1 && v.rating <= 5)
    ? { error: "Please add your name, a rating from 1 to 5, and a comment." } : v;
};

app.use(express.json({ limit: "10kb" }));

// ---- Public ----
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};
  if (!str(name, 100) || !/^\S+@\S+\.\S+$/.test(str(email, 200)) || !str(message, 2000)) {
    return res.status(400).json({ error: "Please fill in your name, a valid email, and a message." });
  }
  const f = path.join(__dirname, "messages.json");
  const list = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : [];
  list.push({ name: str(name, 100), email: str(email, 200), message: str(message, 2000), at: new Date().toISOString() });
  fs.writeFileSync(f, JSON.stringify(list, null, 2));
  res.json({ ok: true });
});

app.post("/api/book", (req, res) => {
  const b = req.body || {};
  if (!str(b.name, 100) || !str(b.address, 300) || !str(b.service, 100)) {
    return res.status(400).json({ error: "Please fill in your name, address and service." });
  }
  const d = read();
  d.bookings.push({
    id: crypto.randomUUID(), createdAt: new Date().toISOString(), type: "appointment", status: "pending", date: "",
    name: str(b.name, 100), address: str(b.address, 300), service: str(b.service, 100),
  });
  write(d);
  res.json({ ok: true });
});

// Customers see approved reviews only; new reviews wait for your approval
app.get("/api/reviews", (_req, res) => {
  res.json(read().reviews.filter((r) => r.status === "approved").map(({ id, name, rating, comment, createdAt }) => ({ id, name, rating, comment, createdAt })));
});
const reviewTries = new Map();
app.post("/api/reviews", (req, res) => {
  const now = Date.now();
  const recent = (reviewTries.get(req.ip) || []).filter((t) => now - t < 3600e3);
  if (recent.length >= 5) return res.status(429).json({ error: "Too many reviews from this device. Please try again later." });
  const v = cleanReview({ ...req.body, status: "pending" });
  if (v.error) return res.status(400).json(v);
  reviewTries.set(req.ip, [...recent, now]);
  const d = read();
  d.reviews.push({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...v });
  write(d);
  res.json({ ok: true });
});

// ---- Admin ----
const tries = new Map();
app.post("/api/admin/login", (req, res) => {
  const t = tries.get(req.ip) || { n: 0, at: Date.now() };
  if (Date.now() - t.at > 15 * 60e3) { t.n = 0; t.at = Date.now(); }
  if (t.n >= 10) return res.status(429).json({ error: "Too many tries. Please wait 15 minutes." });
  const { username, password } = req.body || {};
  if (same(username, ADMIN_USER) && same(password, ADMIN_PASS)) { tries.delete(req.ip); return res.json({ token: makeToken() }); }
  t.n++; tries.set(req.ip, t);
  res.status(401).json({ error: "Wrong username or password." });
});

// Full CRUD for bookings and receipts
function crud(name, clean) {
  const base = `/api/admin/${name}`;
  app.get(base, auth, (_q, res) => res.json(read()[name]));
  app.post(base, auth, (req, res) => {
    const v = clean(req.body);
    if (v.error) return res.status(400).json(v);
    const d = read();
    const item = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...v };
    if (name === "receipts") {
      const max = d.receipts.reduce((m, r) => Math.max(m, parseInt(String(r.no).slice(3)) || 0), 0);
      item.no = "GS-" + String(max + 1).padStart(4, "0");
    }
    d[name].push(item); write(d); res.json(item);
  });
  app.put(`${base}/:id`, auth, (req, res) => {
    const d = read(); const i = d[name].findIndex((x) => x.id === req.params.id);
    if (i < 0) return res.status(404).json({ error: "Not found." });
    const v = clean({ ...d[name][i], ...req.body });
    if (v.error) return res.status(400).json(v);
    d[name][i] = { ...d[name][i], ...v }; write(d); res.json(d[name][i]);
  });
  app.delete(`${base}/:id`, auth, (req, res) => {
    const d = read(); d[name] = d[name].filter((x) => x.id !== req.params.id); write(d); res.json({ ok: true });
  });
}
crud("bookings", cleanBooking);
crud("receipts", cleanReceipt);
crud("reviews", cleanReview);

// ---- Serve the built React app in production ----
const dist = path.join(__dirname, "..", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
