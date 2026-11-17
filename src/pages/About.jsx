import { Link } from "react-router-dom";
import { logo, gallery } from "../data.js";
import Reviews from "../components/Reviews.jsx";

const values = [
  ["Creativity", "Every set is a chance to try something new and make it yours."],
  ["Affordability", "Pretty nails should never cost too much."],
  ["Confidence", "We want you to leave feeling happy and proud of your nails."],
  ["Friendliness", "We reply, we listen, and we treat every customer like a friend."],
  ["Teamwork", "Six girls, one goal. We grow better together."],
  ["Quality", "High quality products, a clean and safe space, and results that last."],
];
const facts = [["6", "girls behind every set"], ["₱50", "nail art starts at"], ["Home", "service available"]];
const frame = "bg-white p-2 pb-7 shadow-xl";

export default function About() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blush via-petal to-nude/70">
        <span aria-hidden="true" className="sparkle absolute left-[8%] top-[14%] text-3xl text-gold">✦</span>
        <span aria-hidden="true" className="sparkle absolute bottom-[12%] right-[10%] text-2xl text-rose" style={{ animationDelay: "1s" }}>✦</span>
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
          <div>
            <img src={logo} alt="Nails by Glossy Six logo" className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg" />
            <p className="mt-6 font-script text-3xl text-rose">Our story</p>
            <h1 className="mt-1 text-4xl font-bold leading-tight sm:text-5xl">Six girls. One glossy goal.</h1>
            <p className="mt-5 max-w-md text-lg">
              Nails by Glossy Six started with six girls who love creating beautiful, creative nail designs, and a simple wish: pretty nails shouldn't cost too much.
            </p>
          </div>
          <div className="relative mx-auto h-[26rem] w-full max-w-sm" aria-hidden="true">
            <figure className={`absolute left-0 top-6 w-44 -rotate-6 ${frame}`}><img src="/images/gel-ombre.jpg" alt="" className="aspect-[4/5] w-full object-cover" /></figure>
            <figure className={`absolute right-0 top-0 w-44 rotate-6 ${frame}`}><img src="/images/art-3d.jpg" alt="" className="aspect-[4/5] w-full object-cover" /></figure>
            <figure className={`absolute bottom-0 left-1/4 z-10 w-48 rotate-2 ${frame}`}><img src="/images/art-fullset.jpg" alt="" className="aspect-[4/5] w-full object-cover" /></figure>
          </div>
        </div>
      </section>

      {/* FACTS */}
      <section className="bg-rose text-white">
        <dl className="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-5 py-6 text-center">
          {facts.map(([n, l]) => (
            <div key={l}><dt className="font-display text-3xl font-bold sm:text-4xl">{n}</dt><dd className="text-sm sm:text-base">{l}</dd></div>
          ))}
        </dl>
      </section>

      {/* STORY */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="font-script text-4xl text-rose sm:text-5xl">Your beauty, your style, your shine.</p>
        <p className="mt-6 text-lg">
          We noticed that many students, teens and young adults love nail art but can't always afford to try new designs. So we made a nail art service that is cute, creative and easy on the wallet.
        </p>
        <p className="mt-4 text-lg">
          Today we share our work online and keep doing what we love: making you feel happy and confident with your nails.
        </p>
      </section>

      {/* VISION + MISSION */}
      <section className="mx-auto grid max-w-5xl gap-5 px-5 md:grid-cols-2">
        <div className="rounded-[2rem] bg-rose p-8 text-white">
          <h2 className="text-3xl font-bold">Our vision</h2>
          <p className="mt-3 text-lg">To be the go-to nail art brand for students and young adults, known for creative designs and prices everyone can enjoy.</p>
        </div>
        <div className="rounded-[2rem] bg-nude p-8">
          <h2 className="text-3xl font-bold text-rose">Our mission</h2>
          <p className="mt-3 text-lg">To give customers pretty, well-made nails at an affordable price, and to make every visit a happy and confident moment.</p>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">What we value</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map(([t, d], i) => (
            <li key={t} className="rounded-3xl border border-blush bg-white p-6 shadow-sm">
              <span className="font-display text-sm font-bold text-gold">0{i + 1} ✦</span>
              <p className="mt-1 font-display text-xl font-bold text-rose">{t}</p>
              <p className="mt-1">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* CUSTOMER REVIEWS */}
      <Reviews />

      {/* GALLERY */}
      <section className="bg-blush/40">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Our work</h2>
          <p className="font-script text-2xl text-rose">Made with love, one set at a time.</p>
          <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4">
            {gallery.map((src) => (
              <img key={src} src={src} alt="Nails by Glossy Six work" loading="lazy" className="mb-3 w-full break-inside-avoid rounded-2xl object-cover shadow-sm" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="rounded-[2rem] bg-gradient-to-r from-rose to-[#C97A8E] px-6 py-12 text-center text-white">
          <p className="font-script text-3xl">Home service available</p>
          <h2 className="mt-1 text-3xl font-bold sm:text-4xl">We bring your nail glow to you!</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/book" className="btn bg-white text-rose hover:bg-blush">Book your slot</Link>
            <Link to="/services" className="btn border border-white/70 hover:bg-white/10">See services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
