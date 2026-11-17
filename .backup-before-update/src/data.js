// Edit your business details, services and prices here.
export const business = {
  name: "Nails by Glossy Six",
  email: "glossysix06@gmail.com",
  address: "632 Blvd Street, San Agustin, City of San Fernando, Pampanga",
  // Used by the map on the Contact page. Edit if the pin is off.
  mapQuery: "San Agustin, City of San Fernando, Pampanga, Philippines",
  // Replace "#" with your real page links
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61595140597464&rdid=47cP5Y6me6HLvap4&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CHdBb2SH2%2F#"},
    { label: "Instagram", href: "https://www.instagram.com/nailsbyglossysix/" },
  ],
};

const img = (n) => `/images/${n}.jpg`;

// Prices come from your Nail Menu poster. A "+" means the price starts at that amount.
export const categories = [
  {
    id: "gel-extensions",
    title: "Gel Extensions",
    tagline: "Longer nails, more possibilities!",
    items: [
      { name: "Natural / Plain", price: "₱350", image: img("gel-natural"), desc: "A clean, glossy set in a soft natural shade." },
      { name: "Classic French", price: "₱400", image: img("gel-french"), desc: "Timeless white tips on a sheer, natural base." },
      { name: "Ombre", price: "₱450", image: img("gel-ombre"), desc: "A soft, blended fade from one shade to the next." },
      { name: "Glitter / Chrome", price: "₱500", image: img("gel-chrome"), desc: "Sparkle or mirror shine for a standout set." },
      { name: "Custom Design", price: "₱550+", image: img("gel-custom"), desc: "Your idea, our hands. Tell us the look you want." },
    ],
  },
  {
    id: "custom-nail-art",
    title: "Custom Nail Art",
    tagline: "Small details, big difference!",
    items: [
      { name: "Simple Art", price: "₱50", image: img("art-simple"), desc: "A little accent like a line, dot, or tiny shape." },
      { name: "Detailed Art", price: "₱80", image: img("art-detailed"), desc: "Hand-painted patterns with extra detail." },
      { name: "3D / Charms", price: "₱100+", image: img("art-3d"), desc: "Raised designs and charms for extra personality." },
      { name: "Seasonal / Trend Designs", price: "₱100+", image: img("art-seasonal"), desc: "Fresh looks for the season and what's trending." },
      { name: "Full Set Design", price: "₱150+", image: img("art-fullset"), desc: "A matching design across every nail." },
    ],
  },
  {
    id: "builder-gel-upgrade",
    title: "Builder Gel Upgrade",
    tagline: "Stronger nails, longer lasting!",
    items: [
      { name: "Builder Gel (Natural)", price: "₱150", image: img("builder-natural"), desc: "A strengthening layer in a natural finish." },
      { name: "Builder Gel (With Color)", price: "₱180", image: img("builder-color"), desc: "Extra strength plus your favorite shade." },
      { name: "Builder Gel (With Design)", price: "₱220+", image: img("builder-design"), desc: "Extra strength plus a design of your choice." },
    ],
  },
  {
    // These are listed on your services poster but have no price yet. Add prices here.
    id: "more-services",
    title: "More Services",
    tagline: "Everyday care, beautifully done.",
    items: [
      { name: "Gel Polish", price: "Ask us", image: img("more-gel"), desc: "Long-lasting shine in your favorite color." },
      { name: "Manicure & Pedicure", price: "Ask us", image: img("more-pedi"), desc: "Neat, clean hands and feet with a polished finish." },
      { name: "Nail Repair", price: "Ask us", image: img("more-repair"), desc: "Fix for a broken or lifted nail." },
    ],
  },
];

// Flat list used by the booking form and admin
export const services = categories.flatMap((c) => c.items.map((i) => ({ ...i, category: c.title })));
export const logo = img("logo");
export const gallery = ["gel-custom", "art-detailed", "gel-chrome", "art-seasonal", "builder-color", "art-simple", "gel-french", "builder-design"].map(img);
