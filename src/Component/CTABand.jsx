export default function CTABand() {
  return (
    /* ─── CTA BAND ─── */
    <section data-aos="zoom-in-up" className="relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-700 to-ink-600"></div>

      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_30%_50%,_rgb(var(--color-mint-400)_/_0.4),_transparent_60%),radial-gradient(ellipse_at_70%_50%,_rgb(var(--color-mint-300)_/_0.28),_transparent_60%)]"></div>

      <div className="absolute inset-0 bg-grid-faint [background-size:50px_50px] opacity-[0.04]"></div>

      <div className="relative max-w-4xl mx-auto text-center text-white flex flex-col items-center gap-7">
        {/* Badge */}
        <span data-aos="fade-up" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint-400/20 backdrop-blur border border-mint-400/30 text-xs font-bold tracking-widest uppercase text-mint-300">
          <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-ping"></span>
          Keep your servers alive 24/7
        </span>

        {/* Heading */}
        <h2 data-aos="fade-up" data-aos-delay="100" className="font-display font-extrabold text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] !text-white">
          Ready to monitor
          <br />
          <span className="font-serif-italic text-gradient-mint">your servers?</span>
        </h2>

        {/* Subtext */}
        <p data-aos="fade-up" data-aos-delay="180" className="max-w-lg text-base leading-relaxed text-gray-300 sm:text-lg">
          Monitor your URLs, prevent server sleep, and track uptime with real-time alerts — all in one place.
        </p>

        {/* Buttons */}
        <div data-aos="fade-up" data-aos-delay="260" className="flex flex-col sm:flex-row gap-3">
          <a
            href="#"
            className="group bg-mint-400 hover:bg-mint-300 text-ink font-bold pl-7 pr-2 py-2 rounded-full inline-flex items-center gap-3 transition-all hover:-translate-y-0.5 shadow-glow-mint"
          >
            <span>Get Started Free</span>
            <span className="bg-ink text-mint-400 rounded-full w-9 h-9 flex items-center justify-center group-hover:rotate-45 transition-transform">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
          </a>

          <a
            href="#"
            className="bg-white/5 hover:bg-white/10 backdrop-blur border border-white/20 text-white px-7 py-3.5 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-glow-white !text-white"
          >
            View Dashboard
          </a>
        </div>

        {/* Bottom Points */}
        <div data-aos="fade-up" data-aos-delay="340" className="flex items-center gap-6 text-xs text-white/50 pt-2 flex-wrap justify-center">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-400"></span>
            100% Free
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-400"></span>
            No setup required
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-400"></span>
            Instant monitoring
          </span>
        </div>
      </div>
    </section>
  );
}
