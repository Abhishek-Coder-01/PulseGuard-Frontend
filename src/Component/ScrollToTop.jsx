import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    const scrollBtn = document.getElementById("scrollToTopBtn");

    // Show/hide on scroll
    const handleScroll = () => {
      const isVisible = window.pageYOffset > 300;
      scrollBtn.classList.toggle("opacity-0", !isVisible);
      scrollBtn.classList.toggle("pointer-events-none", !isVisible);
      scrollBtn.classList.toggle("opacity-100", isVisible);
      scrollBtn.classList.toggle("pointer-events-auto", isVisible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section>
      {/* Scroll to Top Button */}
      <button
        id="scrollToTopBtn"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 z-40 flex items-center justify-center opacity-0 pointer-events-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 md:w-7 md:h-7 !text-white font-bold"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12l7-7 7 7" />
        </svg>
      </button>
    </section>
  );
}
