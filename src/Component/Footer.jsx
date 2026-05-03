import { useState, useEffect } from "react";
import emailjs from "emailjs-com";

/* ─── Toast Component ─── */
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border border-gray-700/60 backdrop-blur-md text-sm font-medium !text-black"
          style={{
            background: "white",
            animation: "slideInToast 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
            minWidth: "220px",
            maxWidth: "min(90vw, 420px)",
          }}
        >
          {/* Status dot */}
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{
              background: t.type === "success" ? "#10b981" : "#ef4444",
              boxShadow:
                t.type === "success"
                  ? "0 0 8px #10b98199"
                  : "0 0 8px #ef444499",
            }}
          />
          {t.message}
          <button
            onClick={() => removeToast(t.id)}
            className="ml-auto text-gray-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── useToast hook ─── */
function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, addToast, removeToast };
}

/* ─── FOOTER ─── */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const isEmpty = email.trim() === "";

  const handleSubscribe = async () => {
    if (isSubmitting) return;

    if (isEmpty) {
      addToast("Please enter your email address", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast("Please enter a valid email address", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { user_email: email },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      addToast("Subscribed successfully!", "success");
      setEmail("");
    } catch (error) {
      console.error(error);
      addToast("Subscription failed. Try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast Portal */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Animation keyframes */}
      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>

      {/* ─── FOOTER ─── */}
      <footer
        data-aos="fade-up"
        className="bg-gradient-to-b from-gray-900 to-gray-950 text-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-16">

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 mb-12">

            {/* Brand Column */}
            <div data-aos="fade-up-right" className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12h4l3-9 4 18 3-9h4"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    PluseGuard
                  </h2>
                  <p className="text-sm text-gray-400">Real-Time Server Monitoring</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Keep your servers alive 24/7 with real-time monitoring, instant
                alerts, and performance tracking. Prevent downtime and monitor
                all your URLs in one place.
              </p>

              {/* Social Links */}
              <div className="flex gap-3 mb-8">
                {/* Add social icons here if needed */}
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700 w-full max-w-lg">
                <h4 className="font-semibold mb-3 !text-white">Stay Updated</h4>

                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    disabled={isSubmitting}
                    className="flex-1 min-w-0 rounded-lg px-4 py-2 text-sm focus:outline-none text-white transition-all duration-300"
                    style={{
                      background: "#111827",
                      border: `1.5px solid ${inputFocused
                          ? "#10b981"
                          : isEmpty
                            ? "#374151" /* muted/light border when empty */
                            : "#6ee7b7" /* visible border when has text */
                        }`,
                      boxShadow:
                        inputFocused && !isEmpty
                          ? "0 0 0 3px rgba(16,185,129,0.15)"
                          : inputFocused && isEmpty
                            ? "0 0 0 3px rgba(107,114,128,0.15)"
                            : "none",
                      color: isEmpty ? "#6b7280" : "#ffffff",
                    }}
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={isEmpty || isSubmitting}
                    className="px-5 py-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 text-white"
                    style={{
                      background: isEmpty || isSubmitting
                        ? "linear-gradient(to right, #252b33, #4b5563)" /* muted when empty */
                        : "linear-gradient(to right, #10b981, #059669)",
                      opacity: isEmpty || isSubmitting ? 0.7 : 1,
                      cursor: isEmpty || isSubmitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>

                {/* Hint text */}
                <p
                  className="text-xs mt-2 transition-all duration-300"
                  style={{ color: isEmpty ? "#4b5563" : "#6ee7b7" }}
                >
                  {isEmpty
                    ? "Enter your email to get updates"
                    : "Press Enter or click Subscribe ✓"}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div data-aos="zoom-in-up" data-aos-delay="80" className="lg:col-span-1">
              <h3 className="text-lg font-bold mb-6 !text-white">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Home</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Features</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">How It Works</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">FAQ</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>

            {/* Resources */}
            <div data-aos="zoom-in-up" data-aos-delay="140" className="lg:col-span-1">
              <h3 className="text-lg font-bold mb-6 !text-white">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">API Monitoring</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Status Page</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Guides</li>
              </ul>
            </div>

            {/* Support */}
            <div data-aos="zoom-in-up" data-aos-delay="220" className="lg:col-span-2">
              <h3 className="text-lg font-bold mb-6 !text-white">Support</h3>
              <div className="grid grid-cols-2 gap-4 text-gray-400">
                <ul className="space-y-3">
                  <li className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-emerald-400 cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-emerald-400 cursor-pointer transition-colors">Contact Us</li>
                </ul>
                <ul className="space-y-3">
                  <li className="hover:text-emerald-400 cursor-pointer transition-colors">Help Center</li>
                  <li className="hover:text-emerald-400 cursor-pointer transition-colors">FAQ</li>
                  <li className="hover:text-emerald-400 cursor-pointer transition-colors">Community</li>
                </ul>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">99.9%</div>
                  <div className="text-xs text-gray-400">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">24/7</div>
                  <div className="text-xs text-gray-400">Monitoring</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">3K+</div>
                  <div className="text-xs text-gray-400">URLs Tracked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            data-aos="zoom-in"
            data-aos-delay="280"
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm text-center md:text-left">
                ⚡ PluseGuard keeps your servers alive with real-time monitoring
                and instant alerts
                <br />© 2026 PluseGuard. Built by{" "}
                <span className="text-emerald-400 font-medium italic">
                  Abhishek Yadav
                </span>
                .
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-gray-400">System Status:</span>
                  <span className="text-emerald-400 font-medium">
                    All Systems Operational
                  </span>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 ">
              {["React", "Node.js", "MongoDB", "Express", "Tailwind","Local Storage"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs bg-gray-800/50 border border-gray-700 !text-gray-300 hover:border-emerald-500/50 transition-colors"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
