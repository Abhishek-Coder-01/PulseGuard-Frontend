import { useEffect } from "react";

export default function Features() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), index * 70);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll("#features [data-reveal]").forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <section
      id="features"
      data-aos="fade-up"
      className="relative bg-gradient-to-b from-cream via-white to-mint-50/40 px-6 py-28 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900"
    >
      <div className="mx-auto max-w-6xl">
        <div data-aos="fade-up" className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint-300 bg-mint-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-mint-800 dark:border-mint-800 dark:bg-mint-900/30 dark:text-mint-300">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-500"></span>
            Everything Included
          </span>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-tight text-ink">
            Built for developers who
            <br />
            <span className="font-serif-italic text-gradient-mint">hate server sleep</span>
          </h2>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">
            PluseGuard is built to eliminate downtime and ensure your servers and APIs stay active, responsive, and
            monitored 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div
            data-reveal
            data-aos="zoom-in-up"
            className="group relative overflow-hidden rounded-3xl border border-slate-700/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-10 dark:border-slate-700/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:col-span-2 lg:row-span-2"
          >
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-400/12"></div>
            <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_at_bottom_right,_rgba(110,231,183,0.26),_transparent_48%)] opacity-25 dark:bg-[radial-gradient(circle_at_bottom_right,_rgba(52,211,153,0.14),_transparent_52%)]"></div>

            <div className="relative flex h-full flex-col gap-5 text-white">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/12 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Keep-Alive Engine
                </span>
                <div className="flex items-center gap-1.5 text-xs text-emerald-100 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  Pinging Now
                </div>
              </div>

              <h3 className="font-display text-3xl font-bold leading-tight !text-white sm:text-4xl">
                24 / 7 Active <br />
                <span className="font-serif-italic text-emerald-300">Uptime Tracker</span>
              </h3>

              <p className="max-w-md leading-relaxed text-slate-200 dark:text-slate-300">
                Our system continuously monitors your servers and APIs, keeping them alive and tracking performance in
                real-time across all your services.
              </p>

              <div className="mt-auto space-y-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 dark:text-slate-300">Active Keep-Alive Monitors</span>
                  <span className="font-bold text-emerald-300 dark:text-emerald-300">3 running</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400"></span>
                    <span className="flex-1 text-xs text-slate-200">api.myapp.com</span>
                    <span className="text-[10px] font-bold text-emerald-300">124ms ↑</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/12">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" style={{ width: "92%" }}></div>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400"></span>
                    <span className="flex-1 text-xs text-slate-200">render-app.onrender.com</span>
                    <span className="text-[10px] font-bold text-emerald-300">89ms ↑</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/12">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" style={{ width: "97%" }}></div>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-400"></span>
                    <span className="flex-1 text-xs text-slate-200">staging.myproject.io</span>
                    <span className="text-[10px] font-bold text-amber-300">340ms ↑</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/12">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-300" style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-3">
                  <div>
                    <div className="text-xl font-display font-bold text-emerald-300">99.9%</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Uptime</div>
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold text-emerald-300">185ms</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Avg Ping</div>
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold text-emerald-300">3.2K</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">URLs Live</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            data-reveal
            data-aos="fade-up"
            data-aos-delay="80"
            className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-100 to-mint-200 transition-transform group-hover:scale-110 dark:from-emerald-500/15 dark:to-emerald-400/10">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-900 dark:text-gray-100"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="2,12 6,12 8,6 11,18 14,10 16,14 18,12 22,12" />
              </svg>
            </div>
            <h3 className="mb-2 font-display text-xl font-bold text-gray-900 dark:text-gray-100">Live Response Graph</h3>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              See your server&apos;s response time plotted in real time. Spot slowdowns and patterns before they become
              outages, every ping recorded and graphed.
            </p>
          </div>

          <div
            data-reveal
            data-aos="fade-up"
            data-aos-delay="140"
            className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-100 to-mint-200 transition-transform group-hover:scale-110 dark:from-emerald-500/15 dark:to-emerald-400/10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-900 dark:text-gray-100">
                <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="mb-2 font-display text-xl font-bold text-gray-900 dark:text-gray-100">Instant Down Alerts</h3>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              The moment your server returns an error or stops responding, PluseGuard fires an alert so you know before
              your users do.
            </p>
          </div>

          <div
            data-reveal
            data-aos="fade-up"
            data-aos-delay="200"
            className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-100 to-mint-200 transition-transform group-hover:scale-110 dark:from-emerald-500/15 dark:to-emerald-400/10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-900 dark:text-gray-100">
                <path
                  d="M4 19l5-7 4 4 5-10 2 13"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-display text-xl font-bold text-gray-900 dark:text-gray-100">Performance Analytics</h3>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              Clear, real-time reports showing your server response time, uptime, and system performance helping you
              detect and fix issues faster.
            </p>
          </div>

          <div
            data-reveal
            data-aos="fade-up"
            data-aos-delay="260"
            className="relative overflow-hidden rounded-3xl border border-mint-300/50 bg-gradient-to-br from-mint-50 to-mint-100 p-7 md:col-span-2 lg:col-span-2 sm:p-8 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800"
          >
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-mint-300/40 blur-3xl dark:bg-emerald-400/10"></div>
            <div className="relative flex min-w-[240px] flex-1 flex-wrap items-start gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-400 to-mint-600 shadow-glow-soft">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12l4 4 10-10"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="min-w-[240px] flex-1">
                <h3 className="mb-2 font-display text-2xl font-bold text-gray-900 dark:text-gray-100">Always Active. No Downtime.</h3>
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                  No server sleep. No interruptions. Just continuous 24/7 monitoring that keeps your services running
                  smoothly from the moment you start.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-mint-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-gray-900 backdrop-blur dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    Render
                  </span>
                  <span className="rounded-full border border-mint-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-gray-900 backdrop-blur dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    Railway
                  </span>
                  <span className="rounded-full border border-mint-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-gray-900 backdrop-blur dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    APIs
                  </span>
                  <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-mint-300 dark:bg-gray-950 dark:text-emerald-300">
                    + Any HTTP URL URLs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
