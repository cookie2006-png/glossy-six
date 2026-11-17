// A row of glossy nails drawn with CSS only.
const nails = [
  { bg: "linear-gradient(160deg,#F9DDE2,#EFA9B8)", h: "h-24", r: "-6deg", d: "0s" },
  { bg: "linear-gradient(160deg,#F3DCCF,#DDB8A5)", h: "h-28", r: "-2deg", d: ".08s" },
  { bg: "linear-gradient(160deg,#FFFFFF,#F2E6E2)", h: "h-32", r: "0deg",  d: ".16s" },
  { bg: "linear-gradient(160deg,#F6C3CE,#D9758C)", h: "h-28", r: "3deg",  d: ".24s" },
  { bg: "linear-gradient(160deg,#EBD3C6,#CFA692)", h: "h-24", r: "7deg",  d: ".32s" },
];

export default function NailRow() {
  return (
    <div className="flex items-end justify-center gap-3" aria-hidden="true">
      {nails.map((n, i) => (
        <div
          key={i}
          className={`nail relative w-14 sm:w-16 ${n.h} rounded-t-[2rem] rounded-b-xl shadow-md`}
          style={{ background: n.bg, "--r": n.r, animationDelay: n.d }}
        >
          <span className="absolute left-2 top-3 h-1/2 w-2 rounded-full bg-white/70" />
        </div>
      ))}
    </div>
  );
}
