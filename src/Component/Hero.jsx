import { useAuth, useClerk } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import howItWorks from "../assets/Demo.mp4";

const trustHighlights = ["24/7 monitoring", "Instant alerts", "Zero downtime", "Real-time insights",];

const marqueeItems = [
  {
    label: "Servers",
    tone: "text-indigo-500 dark:text-indigo-400",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="7" rx="2" fill="currentColor" className="opacity-100" />
        <rect x="3" y="14" width="18" height="7" rx="2" fill="currentColor" className="opacity-70" />
        <circle cx="7" cy="6.5" r="1" fill="currentColor" className="opacity-30" />
        <circle cx="7" cy="17.5" r="1" fill="currentColor" className="opacity-30" />
      </svg>
    ),
  },
  {
    label: "APIs",
    tone: "text-amber-500 dark:text-amber-400",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7L12 3L20 7L12 11L4 7Z" fill="currentColor" className="opacity-80" />
        <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 17L12 21L20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70" />
      </svg>
    ),
  },
  {
    label: "Endpoints",
    tone: "text-rose-500 dark:text-rose-400",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="6" r="2.5" fill="currentColor" />
        <circle cx="6" cy="18" r="2.5" fill="currentColor" className="opacity-70" />
        <circle cx="18" cy="18" r="2.5" fill="currentColor" className="opacity-40" />
        <path d="M12 8.5L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 8.5L16.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-70" />
      </svg>
    ),
  },
  {
    label: "Web Apps",
    tone: "text-cyan-500 dark:text-cyan-400",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="3" fill="currentColor" className="opacity-80" />
        <rect x="5" y="6" width="14" height="8" rx="1" fill="currentColor" className="opacity-40" />
        <path d="M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Services",
    tone: "text-emerald-500 dark:text-emerald-400",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="currentColor" className="opacity-80" />
        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-white dark:text-gray-950" />
      </svg>
    ),
  },
  {
    label: "Systems",
    tone: "text-violet-500 dark:text-violet-400",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="14" y="4" width="7" height="7" rx="2" fill="currentColor" className="opacity-80" />
        <rect x="3" y="13" width="7" height="7" rx="2" fill="currentColor" className="opacity-60" />
        <rect x="14" y="13" width="7" height="7" rx="2" fill="currentColor" className="opacity-35" />
      </svg>
    ),
  },
  {
    label: "Network",
    tone: "text-pink-500 dark:text-pink-400",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="5.5" r="2.5" fill="currentColor" />
        <circle cx="5.5" cy="18.5" r="2.5" fill="currentColor" className="opacity-70" />
        <circle cx="18.5" cy="18.5" r="2.5" fill="currentColor" className="opacity-40" />
        <path d="M10.5 7.8L7.2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M13.5 7.8L16.8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-70" />
        <path d="M8.2 18.5H15.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
      </svg>
    ),
  },
];

function TrustItem({ label }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
      <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.8" className="opacity-30" />
        <path d="M6 10.2L8.8 13L14 7.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </div>
  );
}

function MarqueeItem({ label, tone, icon }) {
  return (
    <div className="marquee-item">
      <span className={tone}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export default function Hero() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const primaryHref = isSignedIn ? "#dashboard" : "#";
  const primaryLabel = isSignedIn ? "View Dashboard" : "Get Started Free";

  const handlePrimaryClick = (event) => {
    if (isSignedIn) {
      return;
    }

    event.preventDefault();
    openSignIn();
  };

  const marqueeLoop = [...marqueeItems, ...marqueeItems];

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen overflow-hidden px-6 pb-20 pt-32 hero-bg"
      >
        <div className="absolute inset-0 pointer-events-none stripe-bg"></div>
        <div className="absolute inset-0 pointer-events-none bg-grid-faint [background-size:60px_60px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"></div>

        <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-gradient-to-br from-mint-200 to-mint-400 opacity-40 blur-3xl animate-pulse-soft pointer-events-none lg:left-24"></div>
        <div
          className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-gradient-to-br from-mint-100 to-mint-300 opacity-50 blur-3xl animate-pulse-soft pointer-events-none lg:right-24"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center gap-7 text-center">
          <div
            data-aos="fade-up"
            className="inline-flex items-center gap-2 rounded-full border border-mint-300/50 bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur animate-fade-up dark:border-gray-700 dark:bg-gray-900/70"
          >
            <div className="flex -space-x-1.5">
              <div className="h-5 w-5 rounded-full border-2 border-white bg-gradient-to-br from-mint-300 to-mint-500 dark:border-gray-900"></div>
              <div className="h-5 w-5 rounded-full border-2 border-white bg-gradient-to-br from-amber-300 to-orange-400 dark:border-gray-900"></div>
              <div className="h-5 w-5 rounded-full border-2 border-white bg-gradient-to-br from-blue-300 to-violet-400 dark:border-gray-900"></div>
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Trusted by <span className="text-mint-700 dark:text-mint-500">24/7</span> monitoring
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-mint-700 dark:text-mint-500">
              <svg className="h-2.5 w-2.5 text-mint-500" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <circle cx="5" cy="5" r="3" fill="currentColor" />
              </svg>
              Live
            </span>
          </div>

          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-display animate-fade-up text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[1.02] text-ink"
            style={{ animationDelay: "0.1s" }}
          >
            Never Let Your
            <br />
            <span className="text-gradient-mint">Server Sleep</span> Again
            <br />
            <span className="relative font-serif-italic text-ink">
              ever.
              <svg className="absolute -bottom-3 left-0 w-full text-mint-500 dark:text-mint-400" viewBox="0 0 220 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 9 Q 55 2 110 6 T 218 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="180"
            className="max-w-xl animate-fade-up text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg"
            style={{ animationDelay: "0.2s" }}
          >
            Monitor your <span className="font-semibold text-gray-900 dark:text-gray-100">URLs</span> and prevent server
            sleep with <span className="font-semibold text-green-600 dark:text-green-400">24 / 7 monitoring</span>,
            real-time alerts, and performance tracking to keep your systems active and responsive.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="260"
            className="flex animate-fade-up flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href={primaryHref}
              onClick={handlePrimaryClick}
              className="magnetic-cta group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-7 pr-2 text-sm font-semibold !text-white shadow-xl transition-all hover:-translate-y-0.5 dark:hover:bg-gray-700 !dark:hover:shadow-glow-mint"
            >
              <span>{primaryLabel}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-400 !text-ink transition-all group-hover:rotate-45 group-hover:bg-white group-hover:!text-ink dark:group-hover:!text-gray-950">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </span>
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-controls="howItWorksModal"
              type="button"
              className="group inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/70 px-6 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-mint-300 hover:bg-white dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-100 dark:hover:bg-gray-900"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint-100 dark:bg-mint-200 text-mint-700 transition-colors group-hover:bg-mint-400 group-hover:text-ink dark:bg-mint-200/10 dark:text-mint-500">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                  <path d="M3 1l5 4-5 4z" />
                </svg>
              </span>
              Watch demo (+2 min)
            </button>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="340"
            className="flex flex-wrap items-center justify-center gap-6 animate-fade-up sm:gap-8"
            style={{ animationDelay: "0.4s" }}
          >
            {trustHighlights.map((item) => (
              <TrustItem key={item} label={item} />
            ))}
          </div>
        </div>

        <div
          data-aos="zoom-in-up"
          data-aos-delay="420"
          className="relative z-10 mx-auto mt-16 max-w-6xl px-4"
        >
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
            TRUSTED FOR 24/7 MONITORING
          </p>

          <div className="relative overflow-hidden py-4">
            <div className="marquee overflow-hidden py-4">
              <div className="marquee-track flex select-none items-center gap-4">
                {marqueeLoop.map((item, index) => (
                  <MarqueeItem key={`${item.label}-${index}`} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <a
          href="#features"
          className="group absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-gray-500 transition-colors hover:text-mint-600 dark:text-gray-400 dark:hover:text-mint-400"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">Explore</span>
          <svg
            className="h-5 w-5 animate-bounce-slow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </a>
      </section>

      {open && (
        <div id="howItWorksModal" role="dialog" aria-modal="true" aria-labelledby="howItWorksTitle" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden transform transition-all">
            <div className="flex items-center justify-between p-1 md:p-3 border-b border-gray-100">
              <h3 id="howItWorksTitle" className="text-md md:text-lg font-black dark:text-white text-gray-900 pl-2 md:pl-0">Watch How It Works?</h3>
              <button
                ref={closeButtonRef}
                onClick={() => setOpen(false)}
                aria-label="Close video"
                className="ml-3 bg-gray-100 active:scale-90 hover:bg-gray-200 mr-2 md:mr-0 text-gray-800 w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="bg-black">
              <video controls autoPlay className="w-full max-h-[80vh] bg-black">
                <source src={howItWorks} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
