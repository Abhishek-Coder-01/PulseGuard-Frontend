import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "./Component/Navbar";
import Hero from "./Component/Hero";
import Features from "./Component/Features";
import HowItWorks from "./Component/HowItWorks";
import Testimonials from "./Component/Testimonials";
import Pricing from "./Component/Pricing";
import FAQ from "./Component/FAQ";
import CTABand from "./Component/CTABand";
import Footer from "./Component/Footer";
import ScrollToTop from "./Component/ScrollToTop";
import PulseGuardDashboard from "./Dashboard/Dashboard.jsx";
import {SYSTEM_THEME_QUERY, applyTheme, getResolvedTheme, getStoredThemePreference, getSystemTheme, persistThemePreference ,} from "./lib/theme";
import { getProjects } from "./api/Api.js";
import AOS from "aos";
import "aos/dist/aos.css";

const DASHBOARD_HASH = "#dashboard";
const LANDING_ALERT_REFRESH_MS = 15000;

function getActiveHash() {
  return window.location.hash || "#hero";
}

function formatAlertTime(timestamp) {
  if (!Number.isFinite(timestamp)) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function sortAlerts(alerts) {
  const severityOrder = { critical: 0, warning: 1, info: 2, success: 3 };

  return [...alerts].sort((first, second) => {
    const levelDifference = (severityOrder[first.level] ?? 99) - (severityOrder[second.level] ?? 99);

    if (levelDifference !== 0) {
      return levelDifference;
    }

    return (second.timestamp ?? 0) - (first.timestamp ?? 0);
  });
}

function createNavbarAlerts(projects) {
  const alerts = (Array.isArray(projects) ? projects : []).flatMap((project) => {
    const lastCheck = project?.lastCheckedAt
      ? new Date(project.lastCheckedAt).getTime()
      : project?.updatedAt
        ? new Date(project.updatedAt).getTime()
        : Date.now();

    if (project?.lastStatus === "down") {
      return [{
        key: `${project._id}-down`,
        monitorId: project._id,
        title: "Server down",
        detail: `${project.name} is not responding to the latest health check.`,
        time: formatAlertTime(lastCheck),
        timestamp: lastCheck,
        level: "critical",
      }];
    }

    if (project?.lastStatus === "critical") {
      return [{
        key: `${project._id}-latency`,
        monitorId: project._id,
        title: "Critical latency",
        detail: `${project.name} responded in ${project.lastResponseTime || 0}ms. This is very slow.`,
        time: formatAlertTime(lastCheck),
        timestamp: lastCheck,
        level: "warning",
      }];
    }

    if (project?.lastStatus === "warning") {
      return [{
        key: `${project._id}-warning`,
        monitorId: project._id,
        title: "High latency",
        detail: `${project.name} responded in ${project.lastResponseTime || 0}ms. Performance is degraded.`,
        time: formatAlertTime(lastCheck),
        timestamp: lastCheck,
        level: "info",
      }];
    }

    return [];
  });

  return sortAlerts(alerts);
}

function App() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [activeHash, setActiveHash] = useState(() => getActiveHash());
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());
  const [themePreference, setThemePreference] = useState(() => getStoredThemePreference());
  const [navbarAlerts, setNavbarAlerts] = useState([]);
  const [navbarAlertsLoaded, setNavbarAlertsLoaded] = useState(false);
  const theme = getResolvedTheme(themePreference) ?? systemTheme;

  const toggleTheme = useCallback(() => {
    setThemePreference((previous) => {
      const currentTheme = getResolvedTheme(previous);
      return currentTheme === "dark" ? "light" : "dark";
    });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(getActiveHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
    const handleChange = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    persistThemePreference(themePreference);
  }, [theme, themePreference]);

  useEffect(() => {
    if (activeHash === DASHBOARD_HASH) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return undefined;
    }

    const targetId = activeHash.replace("#", "") || "hero";
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [activeHash]);

  useEffect(() => {
    if (activeHash === DASHBOARD_HASH) {
      return undefined;
    }

    // Parallax floating shapes
    const fl = document.getElementById("floatLeft");
    const fr = document.getElementById("floatRight");
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      if (fl) fl.style.transform = `translate(${-x * 0.5}px, ${-y * 0.4}px)`;
      if (fr) fr.style.transform = `translate(${x * 0.5}px, ${y * 0.4}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Counters
    function animateCount(el) {
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = Math.floor(target * eased);
        if (target >= 1000) {
          el.textContent =
            target >= 1000 && p < 1 ? cur.toLocaleString() : (target / 1000).toFixed(0) + "k+";
        } else if (el.nextElementSibling && el.nextElementSibling.textContent.includes("%")) {
          el.textContent = cur + "%";
        } else if (
          el.nextElementSibling &&
          el.nextElementSibling.textContent.includes("Million")
        ) {
          el.textContent = "$" + cur + "M";
        } else {
          el.textContent = cur + "+";
        }
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const statsObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            statsObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("[data-count]").forEach((el) => statsObs.observe(el));

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      statsObs.disconnect();
    };
  }, [activeHash]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 80,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return undefined;
    }

    if (!isSignedIn) {
      setNavbarAlerts([]);
      setNavbarAlertsLoaded(true);
      return undefined;
    }

    let cancelled = false;
    setNavbarAlertsLoaded(false);

    const loadAlerts = async () => {
      try {
        const projects = await getProjects(getToken);
        if (!cancelled) {
          setNavbarAlerts(createNavbarAlerts(projects));
          setNavbarAlertsLoaded(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.warn("Could not load navbar alerts:", error);
          setNavbarAlerts([]);
          setNavbarAlertsLoaded(true);
        }
      }
    };

    void loadAlerts();
    const intervalId = window.setInterval(loadAlerts, LANDING_ALERT_REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [getToken, isLoaded, isSignedIn]);

  if (activeHash === DASHBOARD_HASH) {
    return <PulseGuardDashboard />;
  }
  
  return (
    <div className="bg-cream text-ink antialiased">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        alerts={navbarAlerts}
        alertsReady={navbarAlertsLoaded}
      />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABand />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
