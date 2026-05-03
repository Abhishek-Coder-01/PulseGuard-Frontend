import { useEffect } from "react";

export default function Testimonials() {
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
    document.querySelectorAll("#testimonials [data-reveal]").forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  return (
    /* ─── TESTIMONIALS ─── */
    <section id="testimonials" data-aos="fade-up" className="relative py-28 px-6 bg-gradient-to-b from-cream via-mint-50/40 to-white">
      <div className="max-w-6xl mx-auto">
        <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint-100 text-mint-800 text-xs font-bold tracking-widest uppercase border border-mint-300">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500"></span>
            Testimonials
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ink">
            Trusted by developers
            <br />
            <span className="font-serif-italic text-gradient-mint">and teams everywhere</span>
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex text-mint-500 text-lg">★★★★★</div>
            <span className="text-sm font-semibold">4.9/5</span>
            <span className="text-sm text-ink/50">from 2,000+ active users</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" data-aos="zoom-in-up" >
          <div
            className="bg-white border border-ink/5 rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <div className="text-mint-500 text-base tracking-widest">★★★★★</div>
              <svg width="28" height="20" viewBox="0 0 28 20" className="text-mint-200">
                <path
                  d="M0 20V12C0 5 4 1 11 0L12 3C8 4 6 7 6 11H11V20H0ZM17 20V12C17 5 21 1 28 0L29 3C25 4 23 7 23 11H28V20H17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="text-ink/75 leading-relaxed flex-1">
              "PluseGuard keeps our servers running <span className="font-bold text-ink">24/7</span> without downtime.
              The monitoring is reliable and alerts are instant."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-ink/5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-mint-300 to-mint-500 flex items-center justify-center font-display font-bold text-ink">
                SM
              </div>
              <div>
                <div className="font-semibold text-sm">Sarah Mitchell</div>
                <div className="text-xs text-ink/50">CEO, BrightBakery Co.</div>
              </div>
            </div>
          </div>

          <div
            className="relative bg-gradient-to-br from-ink via-ink-700 to-ink-600 text-white rounded-3xl p-7 shadow-glow-mint overflow-hidden flex flex-col gap-5 md:scale-105 md:-mt-2"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-mint-500/30 blur-3xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="text-mint-400 text-base tracking-widest">★★★★★</div>
              <span className="px-2.5 py-1 rounded-full bg-mint-400 text-ink text-[10px] font-bold uppercase tracking-wider">
                Verified
              </span>
            </div>
            <p className="relative text-white/85 text-lg leading-relaxed flex-1 font-medium">
              "Easy setup, reliable monitoring, and real-time alerts. I wish I'd found this earlier — it would have
              prevented so much <span className="font-serif-italic text-mint-300">downtime</span>."
            </p>
            <div className="relative flex items-center gap-3 pt-4 border-t border-white/10">
              <div className="w-11 h-11 rounded-full bg-mint-400 flex items-center justify-center font-display font-bold text-ink">
                JO
              </div>
              <div>
                <div className="font-semibold text-sm !text-white">James Okafor</div>
                <div className="text-xs text-white/50">Founder, Okafor Logistics</div>
              </div>
            </div>
          </div>

          <div
            className="bg-white border border-ink/5 rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <div className="text-mint-500 text-base tracking-widest">★★★★★</div>
              <svg width="28" height="20" viewBox="0 0 28 20" className="text-mint-200">
                <path
                  d="M0 20V12C0 5 4 1 11 0L12 3C8 4 6 7 6 11H11V20H0ZM17 20V12C17 5 21 1 28 0L29 3C25 4 23 7 23 11H28V20H17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="text-ink/75 leading-relaxed flex-1">
              "Setup took just minutes. The dashboard is clean, real-time graphs are accurate, and alerts are fast.{" "}
              <span className="font-bold text-ink">10/10</span>."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-ink/5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-mint-300 to-mint-500 flex items-center justify-center font-display font-bold text-ink">
                PS
              </div>
              <div>
                <div className="font-semibold text-sm">Priya Sharma</div>
                <div className="text-xs text-ink/50">Director, ShopEasy India</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
