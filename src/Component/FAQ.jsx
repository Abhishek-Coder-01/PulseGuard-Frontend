import { useEffect } from "react";

const faqItems = [
  {
    icon: "?",
    question: "Is PluseGuard really free?",
    answer:
      "Yes, completely free. No hidden fees, no subscriptions. You can monitor your servers, track uptime, and get alerts without paying anything.",
  },
  {
    icon: "?",
    question: "How fast can I get started?",
    answer:
      "You can start in seconds. Just add your server or API URL and monitoring begins instantly with no complex setup required.",
  },
  {
    icon: "?",
    question: "How does PluseGuard keep servers alive?",
    answer:
      "We continuously ping your server to prevent it from going idle. This keeps your services active while tracking uptime, response time, and performance in real time.",
  },
  {
    icon: "!",
    question: "What happens if my server goes down?",
    answer:
      "You'll get instant alerts. PluseGuard notifies you immediately so you can take action before it impacts your users.",
  },
];

export default function FAQ() {
  useEffect(() => {
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.addEventListener("toggle", function () {
        if (this.open) {
          document.querySelectorAll(".faq-item").forEach((other) => {
            if (other !== this && other.open) {
              other.open = false;
            }
          });
        }
      });

      item.addEventListener("click", function (event) {
        if (event.target.closest("summary")) {
          event.preventDefault();

          const details = this;
          const content = details.querySelector("summary + *");

          if (!details.open) {
            details.open = true;

            const height = content.scrollHeight;
            content.style.overflow = "hidden";
            content.style.maxHeight = "0";
            content.style.opacity = "0";
            content.style.transition =
              "max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease, padding 0.3s ease";

            requestAnimationFrame(() => {
              content.style.maxHeight = `${height}px`;
              content.style.opacity = "1";
            });

            document.querySelectorAll(".faq-item").forEach((other) => {
              if (other !== details && other.open) {
                const otherContent = other.querySelector("summary + *");
                otherContent.style.maxHeight = `${otherContent.scrollHeight}px`;
                otherContent.style.overflow = "hidden";
                otherContent.style.opacity = "1";
                otherContent.style.transition =
                  "max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease, padding 0.3s ease";

                requestAnimationFrame(() => {
                  otherContent.style.maxHeight = "0";
                  otherContent.style.opacity = "0";
                });

                setTimeout(() => {
                  other.open = false;
                  otherContent.style.maxHeight = "";
                  otherContent.style.opacity = "";
                  otherContent.style.overflow = "";
                  otherContent.style.transition = "";
                }, 400);
              }
            });

            setTimeout(() => {
              content.style.maxHeight = "";
              content.style.opacity = "";
              content.style.overflow = "";
              content.style.transition = "";
            }, 400);
          } else {
            content.style.overflow = "hidden";
            content.style.maxHeight = `${content.scrollHeight}px`;
            content.style.opacity = "1";
            content.style.transition =
              "max-height 0.3s ease, opacity 0.25s ease, margin 0.25s ease, padding 0.25s ease";

            requestAnimationFrame(() => {
              content.style.maxHeight = "0";
              content.style.opacity = "0";
            });

            setTimeout(() => {
              details.open = false;
              content.style.maxHeight = "";
              content.style.opacity = "";
              content.style.overflow = "";
              content.style.transition = "";
            }, 300);
          }
        }
      });
    });

    document.querySelectorAll(".faq-item summary + *").forEach((content) => {
      content.style.willChange = "max-height, opacity";
    });
  }, []);

  return (
    <section id="status-pages" data-aos="fade-up" className="relative overflow-hidden bg-cream px-6 py-20 dark:bg-gray-950">
      <div className="pattern-dots-mint absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"></div>

      <div className="relative mx-auto max-w-3xl">
        <div data-aos="fade-up" className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint-300 bg-mint-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-mint-800 shadow-sm dark:border-mint-800 dark:bg-mint-900/30 dark:text-mint-300">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
            </svg>
            FAQ
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Quick <span className="text-mint-600 dark:text-mint-400">answers</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-600 dark:text-gray-400">
            Everything you need to know about PluseGuard monitoring
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              data-aos="fade-up"
              className="faq-item group rounded-2xl border border-gray-200 bg-white p-5 shadow-card transition-all duration-300 hover:shadow-card-hover dark:border-gray-700 dark:bg-gray-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-display font-semibold text-ink">
                <span className="flex items-center gap-3">
                  <span className="text-lg text-mint-600 dark:text-mint-400">{item.icon}</span>
                  {item.question}
                </span>
                <span className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-mint-200 bg-mint-50 text-mint-600 transition-transform duration-300 group-open:rotate-45 dark:border-mint-800 dark:bg-mint-900/30 dark:text-mint-400">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 border-t border-mint-100 pt-4 dark:border-gray-800">
                <p className="flex items-start gap-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <span className="flex-shrink-0 font-bold text-mint-500"></span>
                  <span>{item.answer}</span>
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
