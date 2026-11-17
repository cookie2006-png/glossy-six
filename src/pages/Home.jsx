import { Link } from "react-router-dom";
import NailRow from "../components/NailRow.jsx";

const sparkles = [
  ["left-[6%] top-[12%]", "0s", "text-3xl"], ["right-[8%] top-[10%]", ".8s", "text-2xl"],
  ["left-[45%] top-[4%]", "1.4s", "text-xl"], ["right-[30%] bottom-[10%]", "2s", "text-3xl"],
  ["left-[10%] bottom-[8%]", "1s", "text-2xl"],
];
const ticker = ["Pretty nails", "Affordable", "Hand-painted", "Student-friendly", "Made by six girls"];
const pages = [
  ["/about", "About", "Our story, vision, mission and values."],
  ["/services", "Services", "See what we offer and book your slot."],
  ["/contact", "Contact", "Email, location and map."],
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blush via-petal to-nude/70">
        {sparkles.map(([pos, d, size], i) => (
          <span key={i} aria-hidden="true" className={`sparkle absolute ${pos} ${size} text-rose`} style={{ animationDelay: d }}>✦</span>
        ))}
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div>
            <p className="inline-block rounded-full bg-white/70 px-4 py-1 text-sm font-medium text-rose">
              Nail art in San Fernando, Pampanga · Home service
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.05] sm:text-6xl">
              <span className="italic text-rose">Pretty nails,</span><br />priced for students.
            </h1>
            <p className="mt-5 max-w-md text-lg">
              Six girls, one glossy goal: cute, creative nail art that makes you feel happy and confident.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/book" className="btn btn-primary shadow-lg shadow-rose/30">Book now</Link>
              <Link to="/services" className="btn bg-white/80 hover:bg-white">See services</Link>
            </div>
          </div>
          <div className="scale-110 py-6"><NailRow /></div>
        </div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden bg-rose py-3 text-white" aria-hidden="true">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-lg italic">
          {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => <span key={i}>✦ {t}</span>)}
        </div>
      </div>

      {/* PAGE LINKS (details live on their own pages) */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {pages.map(([to, title, line]) => (
            <Link key={to} to={to} className="rounded-3xl bg-blush/60 p-7 transition hover:-translate-y-1 hover:bg-blush">
              <p className="font-display text-2xl font-bold">{title}</p>
              <p className="mt-2">{line}</p>
              <p className="mt-4 font-medium text-rose">Open &rarr;</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
