import { useEffect } from "react";

export default function Pricing() {
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
    document.querySelectorAll("#pricing [data-reveal]").forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  return (
    /* ─── PRICING ─── */
    <section id="pricing" data-aos="fade-up" className="relative py-28 px-6 bg-gradient-to-b from-white to-mint-50/40">
      <div className="max-w-6xl mx-auto">
        <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint-100 text-mint-800 text-xs font-bold tracking-widest uppercase border border-mint-300">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500"></span>
            Pricing
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ink">
            Simple, transparent
            <br />
            <span className="font-serif-italic text-gradient-mint">usage always free to start</span>
          </h2>
          <p className="text-ink/60">
            PluseGuard is completely free to use — monitor your servers, track performance, and get alerts without any
            cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Starter */}
          <div
            data-reveal
            data-aos="fade-up-right"
            className="bg-white border border-ink/5 rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 flex flex-col gap-5"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-3">Free Plan</div>
              <div className="font-display font-extrabold text-5xl">
                $0<span className="text-base font-medium text-ink/50">/forever</span>
              </div>
              <p className="text-sm text-ink/60 mt-3 leading-relaxed">
                Monitor your servers and APIs for free — with real-time tracking and instant alerts.
              </p>
            </div>

            <ul className="space-y-3 flex-1 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-100 text-mint-700 flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                Unlimited URL Monitoring
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-100 text-mint-700 flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                24/7 Server Uptime Tracking
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-100 text-mint-700 flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                Real-Time Alerts &amp; Notifications
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-100 text-mint-700 flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                Live Performance Graphs
              </li>
            </ul>

            <a
              href="#"
              className="block text-center bg-cream hover:bg-mint-100 border-2 border-ink/10 hover:border-mint-400 px-5 py-3 rounded-full font-semibold text-sm transition-all"
            >
              Start Monitoring Free
            </a>
          </div>

          {/* Growth (featured) */}
          <div
            data-reveal
            data-aos="zoom-in-up"
            data-aos-delay="100"
            className="relative bg-gradient-to-br from-ink via-ink-700 to-ink-600 text-white rounded-3xl p-8 shadow-glow-mint flex flex-col gap-5 md:scale-105 md:-mt-4 overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-mint-500/30 blur-3xl"></div>
            <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-mint-400 text-ink text-[10px] font-extrabold uppercase tracking-wider">
              Most Popular
            </div>

            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-widest text-mint-300 mb-3">Monitoring</div>
              <div className="font-display font-extrabold text-5xl !text-white">
                $0<span className="text-base font-medium text-white/50">/forever</span>
              </div>
              <p className="text-sm text-white/65 mt-3 leading-relaxed">
                Powerful real-time monitoring to keep your servers alive and running 24/7 without downtime.
              </p>
            </div>

            <ul className="relative space-y-3 flex-1 text-sm">
              <li className="flex items-start gap-2.5 !text-white/80">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-400 text-ink flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
                Unlimited URL Monitoring
              </li>
              <li className="flex items-start gap-2.5 !text-white/80">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-400 text-ink flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
                24/7 Server Keep-Alive System
              </li>
              <li className="flex items-start gap-2.5 !text-white/80">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-400 text-ink flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
                Live Performance Graphs
              </li>
              <li className="flex items-start gap-2.5 !text-white/80">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-400 text-ink flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
                Slack + Webhook alerts
              </li>
              <li className="flex items-start gap-2.5 !text-white/80">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-400 text-ink flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
                Public status page
              </li>
              <li className="flex items-start gap-2.5 !text-white/80">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-mint-400 text-ink flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
                +90-day history + export
              </li>
            </ul>

            <a
              href="#"
              className="relative block text-center bg-mint-400 hover:bg-mint-300 text-ink px-5 py-3 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Start Monitoring Free →
            </a>
          </div>

          {/* Enterprise */}
          <div data-reveal data-aos="fade-up-left" data-aos-delay="180" className="bg-white border border-ink/5 rounded-3xl p-8 shadow-card flex flex-col gap-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-3">Why Free?</div>
              <div className="font-display font-extrabold text-3xl">No Cost. No Limits.</div>
              <p className="text-sm text-ink/60 mt-3 leading-relaxed">
                PluseGuard is built for developers — simple, reliable monitoring without subscriptions or hidden fees.
              </p>
            </div>

            <ul className="space-y-3 flex-1 text-sm">
              <li>✔ No hidden fees ever</li>
              <li>✔ No credit card required</li>
              <li>✔ Unlimited monitoring</li>
              <li>✔ No rate limits on pings</li>
              <li>✔ Open for community use</li>
            </ul>

            <a
              href="#"
              className="block text-center bg-cream hover:bg-mint-100 border-2 border-ink/10 hover:border-mint-400 px-5 py-3 rounded-full font-semibold text-sm transition-all"
            >
              Free Forever
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
