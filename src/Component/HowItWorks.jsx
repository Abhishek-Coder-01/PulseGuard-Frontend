import { useEffect } from "react";

export default function HowItWorks() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 70);
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll("#about [data-reveal]").forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  return (
    /* ─── HOW IT WORKS ─── */
    <section id="about" data-aos="fade-up" className="relative px-6 bg-gradient-to-b from-mint-50/40 via-white to-cream">
      <div className="max-w-6xl mx-auto">
        <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint-100 text-mint-800 text-xs font-bold tracking-widest uppercase border border-mint-300">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500"></span>
            How it Works
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ink">
            Up and running in
            <br />
            <span className="font-serif-italic text-gradient-mint">three simple steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 relative" data-aos="zoom-in-up" >
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px border-t-2 border-dashed border-mint-300 -z-0"></div>

          <div
            className="relative bg-white border border-mint-200/60 rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint-400 to-mint-600 text-ink font-display font-extrabold text-2xl flex items-center justify-center shadow-glow-soft mb-5 group-hover:rotate-6 transition-transform">
              01
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Paste Your URL</h3>
            <p className="text-ink/60 text-sm leading-relaxed mb-4">
              Enter the URL of your server, API, or web app. It could be a Render endpoint, a /health route, or any
              public HTTP URL you want to keep alive.
            </p>
            <div className="flex items-center gap-2 text-xs text-mint-700 font-semibold">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              ~1 min setup
            </div>
          </div>

          <div
            className="relative bg-white border border-mint-200/60 rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint-400 to-mint-600 text-ink font-display font-extrabold text-2xl flex items-center justify-center shadow-glow-soft mb-5 group-hover:rotate-6 transition-transform">
              02
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Start Monitoring</h3>
            <p className="text-ink/60 text-sm leading-relaxed mb-4">
              We continuously ping your server — no downtime, no interruptions. Keep it active while tracking
              performance in real time.
            </p>
            <div className="flex items-center gap-2 text-xs text-mint-700 font-semibold">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              24/7 tracking
            </div>
          </div>

          <div
            className="relative bg-gradient-to-br from-ink via-ink-700 to-ink-600 text-white rounded-3xl p-7 shadow-card-hover overflow-hidden group"
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-mint-500/30 blur-3xl"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-mint-400 text-ink font-display font-extrabold text-2xl flex items-center justify-center shadow-glow-mint mb-5 group-hover:rotate-6 transition-transform">
                03
              </div>
              <h3 className="font-display font-bold text-xl mb-2 !text-white">View Insights & Alerts</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Access real-time graphs — no delays, no missed updates. Get instant alerts if your server goes down.
              </p>
              <div className="flex items-center gap-2 text-xs text-mint-300 font-semibold">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Live data &amp; notifications
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
