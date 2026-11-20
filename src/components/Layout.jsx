import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { business } from "../data.js";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
  { to: "/book", label: "Book now", cta: true },
];

// "Book now" is a colored button; the other links are soft pills
const linkClass = ({ isActive }, cta) =>
  cta
    ? `rounded-full bg-rose px-5 py-2 text-center font-bold text-white shadow-md shadow-rose/30 transition-colors hover:bg-berry md:ml-2 ${isActive ? "ring-2 ring-berry/30" : ""}`
    : `rounded-full px-4 py-2 font-semibold transition-colors ${isActive ? "bg-blush text-berry" : "hover:bg-blush/60"}`;

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-blush bg-petal/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link to="/" className="font-script text-3xl text-rose">{business.name}</Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className={(s) => linkClass(s, l.cta)}>{l.label}</NavLink>
            ))}
          </nav>
          <button
            className="rounded-full bg-blush px-4 py-2 font-semibold md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        {open && (
          <nav id="mobile-nav" className="flex flex-col gap-2 px-5 pb-4 md:hidden" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className={(s) => linkClass(s, l.cta)} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-nude/50">
        <div className="mx-auto grid max-w-5xl gap-6 px-5 py-10 sm:grid-cols-2">
          <div>
            <p className="font-script text-3xl text-rose">{business.name}</p>
            <p className="mt-2 max-w-xs">Your beauty, your style, your shine. Home service available.</p>
          </div>
          <div className="space-y-1">
            <p><a className="underline" href={business.gmailLink} target="_blank" rel="noreferrer">{business.email}</a></p>
            <p>{business.address}</p>
            <p className="flex gap-4 pt-2">
              {business.socials.map((s) => (
                <a key={s.label} href={s.href} className="underline" target="_blank" rel="noreferrer">{s.label}</a>
              ))}
            </p>
          </div>
        </div>
        <p className="border-t border-blush py-4 text-center text-sm">
          {import.meta.env.VITE_DEMO === "true" && <span className="mb-1 block">Demo site: bookings and reviews are saved only in your own browser.</span>}
          © {new Date().getFullYear()} {business.name} · <Link to="/admin" className="underline">Admin</Link>
        </p>
      </footer>
    </div>
  );
}
