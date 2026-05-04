import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Bell, ChevronDown, LogOut, MoonStar, SunMedium } from "lucide-react";
import { UserButton, useClerk, useUser } from "@clerk/clerk-react";

const EMPTY_ALERTS = [];
const NOTIFICATION_SEEN_STORAGE_PREFIX = "pulseguard-seen-notifications";
const NOTIFICATION_DISMISSED_STORAGE_PREFIX = "pulseguard-dismissed-notifications";





function normalizeHash(hash) {
  return hash || "#hero";
}
function getNavItems(isDashboard, isSignedIn) {
  const items = [
    { label: "Home", href: "#hero" },
    { label: "Features", href: "#features" },
    { label: "How-It-Works", href: "#about" },
  ];

  if (!isDashboard && isSignedIn) {
    items.push({ label: "Dashboard", href: "#dashboard" });
  }

  return items;
}

function getNotificationAccentClass(level) {
  if (level === "critical") return "bg-red-500 shadow-red-500/30";
  if (level === "warning") return "bg-amber-400 shadow-amber-400/30";
  if (level === "success") return "bg-emerald-400 shadow-emerald-400/30";
  return "bg-sky-400 shadow-sky-400/30";
}

function getNotificationBadgeClass(level) {
  if (level === "critical") {
    return "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300";
  }
  if (level === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
  }
  if (level === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
  }
  return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300";
}


function DesktopUserSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="hidden min-[1187px]:flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2.5 py-2 shadow-sm animate-pulse dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700" />
      <div className="hidden sm:flex min-w-[65px] flex-col gap-1">
        <div className="h-3 w-16 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-600" />
      </div>
      <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700" />
    </div>
  );
}

function DesktopSignedInUser({ user, openUserProfile, signOut, isDashboard, letter }) {
  const userButtonShellRef = useRef(null);

  if (!isDashboard) {
    return (
      <div
        className="hidden min-[1187px]:flex items-center gap-3 rounded-full bg-white pl-2.5 pr-2 py-2 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 dark:bg-gray-100 dark:text-gray-900 border border-gray-200 dark:border-gray-700"
      >
        <div
          onClick={() => openUserProfile()}
          className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white shadow-sm dark:border-gray-200"
        >
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || "User avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            letter
          )}
        </div>
        <div className="hidden sm:flex min-w-[65px] flex-col items-start">
          <span className="text-sm font-semibold leading-none !text-black dark:!text-gray-300">
            {user?.firstName || "Admin"}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              signOut();
            }}
            className="flex items-center gap-1 text-[11px] text-red-500 dark:text-red-400 hover:text-red-600 transition-all duration-200 mt-0.5 font-medium"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
        <a
          href="#dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-gray-900 shadow-md transition-all duration-300 hover:rotate-45 hover:!bg-white dark:text-white hover:!text-black"
        >
          <ArrowUpRight size={18} strokeWidth={2.4} />
        </a>
      </div>
    );
  }

  const triggerUserButtonPopover = () => {
    const trigger = userButtonShellRef.current?.querySelector('button, [role="button"]');
    trigger?.click();
  };

  return (
    <div className="hidden min-[1187px]:flex items-center gap-3 rounded-full border border-gray-200 bg-white/95 px-2.5 py-2 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/95">
      <div
        ref={userButtonShellRef}
        onClick={triggerUserButtonPopover}
        className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
      >
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 rounded-full pointer-events-none",
              userButtonTrigger: "pointer-events-none",
            },
          }}
        />
      </div>
      <div
        onClick={triggerUserButtonPopover}
        className="hidden min-w-[18px] cursor-pointer flex-col items-start leading-tight sm:flex"
      >
        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
          {user?.firstName || "Admin"}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            signOut();
          }}
          className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-500 transition-all duration-200 hover:text-red-600"
        >
          <LogOut size={12} />
          Logout
        </button>
      </div>
      <span
        onClick={(e) => {
          e.stopPropagation();
          triggerUserButtonPopover();
        }}
        className="hidden h-9 w-9 items-center justify-center border border-gray-300 dark:border-gray-700 active:rotate-180 rounded-full bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-300 sm:flex cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <ChevronDown size={16} />
      </span>
    </div>
  );
}

function MobileUserCard({ isDashboard, user, letter, openSignIn, openUserProfile, signOut, isLoading = false }) {
  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className="relative flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/70 px-3 py-3 text-center shadow-sm animate-pulse dark:border-gray-700 dark:bg-gray-800/80"
      >
        <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="h-3 w-12 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-2 w-16 rounded bg-gray-200 dark:bg-gray-600" />
      </div>
    );
  }

  const handlePrimaryAction = () => {
    if (isDashboard) {
      if (user) {
        openUserProfile();
        return;
      }
      openSignIn();
      return;
    }

    window.location.hash = user ? "#dashboard" : "#hero";
    if (!user) {
      openSignIn();
    }
  };

  const label = user ? (user.firstName || "Admin") : "Sign in";

  const sublabel = user
    ? isDashboard
      ? "Admin"
      : null
    : "Admin access";

  return (
    <div className="relative flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/70 px-3 py-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800/80">
      <div
        role="button"
        tabIndex={0}
        onClick={handlePrimaryAction}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handlePrimaryAction();
          }
        }}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gradient-to-br from-violet-600 to-cyan-600 font-bold text-white shadow-sm dark:border-white/10"
      >
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName || "User avatar"}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          letter
        )}
      </div>

      <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-300">
        {label}
      </span>
      {sublabel && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500">{sublabel}</span>
      )}

      {user && (
        <span
          onClick={(event) => {
            event.stopPropagation();
            signOut();
          }}
          className="mt-1 flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-red-400 transition-all duration-300 hover:scale-105 hover:text-red-500"
        >
          <LogOut size={14} />
          Logout
        </span>
      )}
    </div>
  );
}

export default function Navbar({
  theme = "dark",
  onToggleTheme = () => { },
  alerts = EMPTY_ALERTS,
  alertsReady = false,
  isDashboard = false,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [seenNotificationIds, setSeenNotificationIds] = useState([]);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState([]);
  const [notificationFeed, setNotificationFeed] = useState([]);
  const [notificationStateHydrated, setNotificationStateHydrated] = useState(false);
  const [activeHash, setActiveHash] = useState(() => normalizeHash(window.location.hash));
  const desktopNotificationsRef = useRef(null);
  const mobileNotificationsRef = useRef(null);
  const activeNotificationIdsRef = useRef({});
  const notificationOrderRef = useRef({});
  const nextNotificationOrderRef = useRef(0);
  const latestVisibleNotificationKeysRef = useRef([]);
  const previousNotificationsOpenRef = useRef(false);
  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignIn, openUserProfile, signOut } = useClerk();
  const nextTheme = theme === "dark" ? "light" : "dark";
  const labelText = nextTheme === "light" ? "Light mode" : "Dark mode";
  const labelClass = `hidden sm:inline text-xs font-medium ${theme === "light" ? "text-gray-800" : "text-gray-400"
    }`;
  const shouldShowNotifications = isSignedIn;
  const storageUserId = user?.id || "";
  const seenStorageKey = storageUserId
    ? `${NOTIFICATION_SEEN_STORAGE_PREFIX}:${storageUserId}`
    : "";
  const dismissedStorageKey = storageUserId
    ? `${NOTIFICATION_DISMISSED_STORAGE_PREFIX}:${storageUserId}`
    : "";
  const navItems = useMemo(
    () => getNavItems(isDashboard, isSignedIn),
    [isDashboard, isSignedIn]
  );

  const persistNotificationKeys = (storageKey, keys) => {
    if (!isLoaded || !isSignedIn || !storageKey) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(keys));
    } catch {
      // Ignore storage failures and keep in-memory state.
    }
  };

  const isNotificationPersistenceReady =
    !isSignedIn || (Boolean(storageUserId) && notificationStateHydrated);
  const notifications = useMemo(
    () => {
      if (!isNotificationPersistenceReady) {
        return [];
      }

      return (
        notificationFeed.filter(
          (notification) =>
            !dismissedNotificationIds.includes(notification.key)
        )
      );
    },
    [dismissedNotificationIds, isNotificationPersistenceReady, notificationFeed]
  );
  const unseenNotifications = useMemo(
    () => {
      if (!isNotificationPersistenceReady) {
        return [];
      }

      return notifications.filter((notification) => !seenNotificationIds.includes(notification.key));
    },
    [isNotificationPersistenceReady, notifications, seenNotificationIds]
  );
  const letter =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.primaryEmailAddress?.emailAddress?.charAt(0)?.toUpperCase() ||
    "A";

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(normalizeHash(window.location.hash));
      setMobileOpen(false);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    setNotificationStateHydrated(false);

    if (!isSignedIn) {
      setSeenNotificationIds([]);
      setDismissedNotificationIds([]);
      setNotificationStateHydrated(true);
      return;
    }

    if (!storageUserId) {
      return;
    }

    try {
      const savedSeen = window.localStorage.getItem(seenStorageKey);
      const savedDismissed = window.localStorage.getItem(dismissedStorageKey);

      setSeenNotificationIds(savedSeen ? JSON.parse(savedSeen) : []);
      setDismissedNotificationIds(savedDismissed ? JSON.parse(savedDismissed) : []);
    } catch {
      setSeenNotificationIds([]);
      setDismissedNotificationIds([]);
    } finally {
      setNotificationStateHydrated(true);
    }
  }, [dismissedStorageKey, isLoaded, isSignedIn, seenStorageKey, storageUserId]);

  useEffect(() => {
    if (!notificationsOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      const clickedInsideDesktopNotifications =
        desktopNotificationsRef.current?.contains(event.target);
      const clickedInsideMobileNotifications =
        mobileNotificationsRef.current?.contains(event.target);

      if (!clickedInsideDesktopNotifications && !clickedInsideMobileNotifications) {
        setNotificationsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationsOpen]);

  useEffect(() => {
    const nextActiveNotificationIds = { ...activeNotificationIdsRef.current };
    const nextNotificationOrder = { ...notificationOrderRef.current };
    const activeKeys = new Set();
    const activeIncidentIds = new Set();
    const normalizedAlerts = [];

    alerts.forEach((alert) => {
      activeKeys.add(alert.key);

      const incidentId =
        nextActiveNotificationIds[alert.key] || `${alert.key}-${alert.timestamp}`;

      nextActiveNotificationIds[alert.key] = incidentId;

      if (nextNotificationOrder[alert.key] === undefined) {
        nextNotificationOrder[alert.key] = nextNotificationOrderRef.current;
        nextNotificationOrderRef.current += 1;
      }

      activeIncidentIds.add(incidentId);

      if (dismissedNotificationIds.includes(alert.key)) {
        return;
      }

      normalizedAlerts.push({
        ...alert,
        id: incidentId,
        order: nextNotificationOrder[alert.key],
      });
    });

    Object.keys(nextActiveNotificationIds).forEach((key) => {
      if (!activeKeys.has(key)) {
        delete nextActiveNotificationIds[key];
        delete nextNotificationOrder[key];
      }
    });

    activeNotificationIdsRef.current = nextActiveNotificationIds;
    notificationOrderRef.current = nextNotificationOrder;

    normalizedAlerts.sort((first, second) => {
      const firstOrder = first.order ?? Number.MAX_SAFE_INTEGER;
      const secondOrder = second.order ?? Number.MAX_SAFE_INTEGER;
      return firstOrder - secondOrder;
    });

    setNotificationFeed((previous) => {
      const previousById = new Map(
        previous.map((notification) => [notification.id, notification])
      );

      const nextFeed = normalizedAlerts.map(
        (notification) => previousById.get(notification.id) || notification
      );

      return nextFeed.length === previous.length &&
        nextFeed.every((notification, index) => notification === previous[index])
        ? previous
        : nextFeed;
    });

    if (alertsReady) {
      setDismissedNotificationIds((previous) => {
        const next = previous.filter((key) => activeKeys.has(key));
        return next.length === previous.length &&
          next.every((key, index) => key === previous[index])
          ? previous
          : next;
      });
    }
  }, [alerts, alertsReady, dismissedNotificationIds]);

  useEffect(() => {
    if (!alertsReady) {
      return;
    }

    const feedKeys = new Set(notificationFeed.map((notification) => notification.key));
    setSeenNotificationIds((previous) => {
      const next = previous.filter((key) => feedKeys.has(key));
      return next.length === previous.length &&
        next.every((key, index) => key === previous[index])
        ? previous
        : next;
    });
  }, [alertsReady, notificationFeed]);

  useEffect(() => {
    latestVisibleNotificationKeysRef.current = notifications.map((notification) => notification.key);
  }, [notifications]);

  useEffect(() => {
    if (!mobileOpen) {
      setNotificationsOpen(false);
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!shouldShowNotifications) {
      setNotificationsOpen(false);
    }
  }, [shouldShowNotifications]);

  useEffect(() => {
    const wasOpen = previousNotificationsOpenRef.current;

    if (wasOpen && !notificationsOpen && latestVisibleNotificationKeysRef.current.length > 0) {
      setSeenNotificationIds((previous) => {
        const nextIds = new Set(previous);
        latestVisibleNotificationKeysRef.current.forEach((key) => {
          nextIds.add(key);
        });
        const next = Array.from(nextIds);

        persistNotificationKeys(seenStorageKey, next);

        return next.length === previous.length &&
          next.every((id, index) => id === previous[index])
          ? previous
          : next;
      });
    }

    previousNotificationsOpenRef.current = notificationsOpen;
  }, [notificationsOpen]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !seenStorageKey || !notificationStateHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(seenStorageKey, JSON.stringify(seenNotificationIds));
    } catch {
      // Ignore storage failures and keep in-memory state.
    }
  }, [isLoaded, isSignedIn, notificationStateHydrated, seenNotificationIds, seenStorageKey]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !dismissedStorageKey || !notificationStateHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(dismissedStorageKey, JSON.stringify(dismissedNotificationIds));
    } catch {
      // Ignore storage failures and keep in-memory state.
    }
  }, [dismissedNotificationIds, dismissedStorageKey, isLoaded, isSignedIn, notificationStateHydrated]);

  const handleRemoveNotification = (notificationKey) => {
    setDismissedNotificationIds((previous) => {
      const next = previous.includes(notificationKey)
        ? previous
        : [...previous, notificationKey];

      persistNotificationKeys(dismissedStorageKey, next);
      return next;
    }
    );
    setNotificationFeed((previous) =>
      previous.filter((notification) => notification.key !== notificationKey)
    );
  };

  const isActiveNavItem = (href, index) => {
    if (href === "#dashboard") {
      return activeHash === href;
    }

    if (activeHash === href) {
      return true;
    }

    return index === 0 && (activeHash === "#" || activeHash === "#hero");
  };

  return (
    <nav className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="pointer-events-none absolute inset-x-10 -bottom-3 -top-3 rounded-[44px] bg-emerald-200/40 blur-2xl dark:bg-emerald-500/10"></div>
        <div className="relative flex items-center justify-between gap-4 rounded-[38px] border border-gray-200 bg-white/92 px-5 py-3 shadow-xl backdrop-blur-xl sm:px-6 lg:px-7 dark:border-gray-700 dark:bg-gray-900/92">
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#hero"
              className="group relative flex items-center gap-2 sm:gap-3"
              aria-label="PulseGuard Home"
            >
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg transition-transform duration-300 group-hover:scale-105">

                <div className="flex h-[85%] w-[85%] items-center justify-center rounded-full bg-emerald-400/20">
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

              <div className="flex flex-col leading-tight">
                <span className="font-display text-lg font-bold tracking-[-0.03em] text-gray-900 sm:text-xl md:text-[1.45rem] dark:text-gray-100">
                  PulseGuard
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:tracking-[0.26em] dark:text-gray-500">
                  Uptime Monitor
                </span>
              </div>
            </a>
          </div>

          <div className="hidden min-[1187px]:flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800/90">
            {navItems.map((item, index) => {
              const active = isActiveNavItem(item.href, index);

              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-5 py-2.5 text-[15px] font-medium transition-all duration-200 ${active
                    ? "bg-emerald-100 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                    : "text-gray-700 hover:bg-white hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    }`}
                >
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="themeToggle"
              type="button"
              onClick={onToggleTheme}
              className="relative hidden h-12 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 min-[1187px]:inline-flex"
              aria-label={`Switch to ${nextTheme} mode`}
            >
              {theme === "light" ? (
                <SunMedium className="h-4 w-4 text-amber-500" strokeWidth={2.2} />
              ) : (
                <MoonStar className="h-4 w-4 text-emerald-400" strokeWidth={2.2} />
              )}
              <span className={labelClass}>{labelText}</span>
            </button>

            {shouldShowNotifications && (
              <div ref={desktopNotificationsRef} className="relative hidden min-[1187px]:block">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((previous) => !previous)}
                  className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  aria-haspopup="dialog"
                >
                  <Bell className="relative h-4 w-4" strokeWidth={2.2} />
                  {unseenNotifications.length > 0 && (
                    <React.Fragment>
                      <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/30 ring-2 ring-white animate-pulse dark:ring-gray-900"></span>
                      <span className="absolute right-2 top-2 h-3 w-3 rounded-full bg-red-400/20 opacity-75 animate-ping"></span>
                    </React.Fragment>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-[calc(100%+14px)] z-[70] w-[360px] overflow-hidden rounded-[26px] border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-gray-700 dark:bg-gray-900/95">
                    <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-500 dark:text-red-400">
                            Alerts
                          </p>
                          <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Notifications
                          </h3>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            {notifications.length > 0
                              ? `${notifications.length} live alert${notifications.length === 1 ? "" : "s"
                              } from current monitor status`
                              : "All clear. No active notifications right now."}
                          </p>
                        </div>
                        {notifications.length > 0 && (
                          <span className="inline-flex min-w-[2.2rem] items-center justify-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                            {notifications.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {notifications.length > 0 ? (
                      <div className="notification-scrollbar max-h-[320px] overflow-y-auto px-3 py-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="group mb-2 rounded-2xl border border-gray-200 bg-white/80 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/70 dark:hover:border-gray-600"
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-lg ${getNotificationAccentClass(
                                  notification.level
                                )}`}
                              ></span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                                      {notification.title}
                                    </p>
                                    <p className="mt-1 inline-block min-w-[4.75rem] whitespace-nowrap text-xs tabular-nums text-gray-600 dark:text-gray-400">
                                      {notification.time}
                                    </p>
                                  </div>
                                  <span
                                    className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getNotificationBadgeClass(
                                      notification.level
                                    )}`}
                                  >
                                    {notification.level}
                                  </span>
                                </div>
                                <div className="mt-3 flex items-start justify-between gap-3">
                                  <p className="min-h-[2.5rem] break-words pr-1 text-xs leading-5 text-gray-700 dark:text-gray-300">
                                    {notification.detail}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveNotification(notification.key)}
                                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                    aria-label={`Remove ${notification.title} notification`}
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-5 py-10 text-center">

                        <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          No pending alerts
                        </p>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          Everything looks stable. New incidents will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!isLoaded ? (
              <DesktopUserSkeleton />
            ) : !isSignedIn ? (
              <button
                type="button"
                onClick={() => openSignIn()}
                className="group hidden items-center gap-3 rounded-full border border-gray-200 bg-white/96 pl-2 pr-3 py-2 text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-200 min-[1187px]:flex"
                aria-label="Open admin login"
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-transparent text-white font-bold shadow-sm">
                    {letter}
                  </div>
                </div>
                <div className="relative hidden items-start sm:flex sm:flex-col">
                  <span className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                    Admin
                  </span>
                  <span className="mt-1 text-[10px] leading-none text-gray-400 dark:text-gray-500">
                    Sign in
                  </span>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-gray-500 dark:text-gray-400 sm:block" strokeWidth={2.2} />
              </button>
            ) : (
              <DesktopSignedInUser
                user={user}
                openUserProfile={openUserProfile}
                signOut={signOut}
                isDashboard={isDashboard}
                letter={letter}
              />
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((previous) => !previous)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 min-[1187px]:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <svg
                className={`h-5 w-5 text-gray-500 transition-all duration-300 dark:text-gray-400 ${mobileOpen ? "rotate-90 scale-90" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-out min-[1187px]:hidden ${mobileOpen ? "max-h-[32rem] opacity-100 pt-4" : "max-h-0 opacity-0"
            }`}
        >
          <div
            ref={mobileNotificationsRef}
            className={`notification-scrollbar overflow-y-auto rounded-[30px] border border-gray-200 bg-white/92 px-5 py-3 shadow-xl backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/95 sm:px-6 lg:px-7 transition-all duration-500 ${mobileOpen ? "translate-y-0 scale-100 max-h-[31rem]" : "-translate-y-3 scale-[0.98]"
              }`}
          >

            <div className={`grid gap-2 ${notificationsOpen ? "hidden" : ""}`}>
              {navItems.map((item, index) => {
                const active = isActiveNavItem(item.href, index);

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${active
                      ? "bg-green-500 text-white shadow-sm shadow-green-500/20"
                      : "bg-white/70 text-gray-800 hover:bg-white dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                      }`}
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`h-4 w-4 ${active ? "text-white" : "text-gray-400 dark:text-gray-500"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                );
              })}
            </div>

            <div className={`mt-3 grid gap-2 ${shouldShowNotifications ? "grid-cols-3" : "grid-cols-2"}`}>
              <button
                type="button"
                onClick={onToggleTheme}
                className="relative flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/70 px-3 py-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800/80"
              >
                <svg
                  className={`h-4 w-4 text-amber-400 ${theme === "light" ? "" : "hidden"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.5M12 18.5V21M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M3 12h2.5M18.5 12H21M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77M12 16a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
                <svg
                  className={`h-5 w-5 text-emerald-400 ${theme === "dark" ? "" : "hidden"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-300">
                  Theme
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{labelText}</span>
              </button>

              {shouldShowNotifications && (
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((previous) => !previous)}
                  aria-expanded={notificationsOpen}
                  aria-label="Toggle live alerts"
                  className={`relative flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${notificationsOpen
                    ? "border-red-300/70 bg-red-50/80 dark:border-red-500/20 dark:bg-red-500/10"
                    : "border-gray-200 bg-white/70 dark:border-gray-700 dark:bg-gray-800/80"
                    }`}
                >
                  {unseenNotifications.length > 0 && (
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/30"></span>
                  )}
                  <svg
                    className="h-5 w-5 text-gray-800 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"
                    />
                  </svg>
                  <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-300">
                    Alerts
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {notifications.length > 0 ? `${notifications.length} live` : "No alerts"}
                  </span>
                </button>
              )}

              <MobileUserCard
                isDashboard={isDashboard}
                user={user}
                letter={letter}
                openSignIn={openSignIn}
                openUserProfile={openUserProfile}
                signOut={signOut}
                isLoading={!isLoaded}
              />
            </div>

            {shouldShowNotifications && notificationsOpen && (
              <div className="mt-3 rounded-[26px] border border-gray-200 bg-white/90 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-2 flex items-center justify-between gap-2 px-1">
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500 dark:text-red-400 sm:text-[12px]">
                      Alerts
                    </p>
                    <p className="truncate text-[11px] text-gray-500 dark:text-gray-400 sm:text-[10px]">
                      {notifications.length > 0
                        ? `${notifications.length} live alert${notifications.length === 1 ? "" : "s"
                        } from current monitor status`
                        : "All clear. No active notifications right now."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-500/10 sm:h-7 sm:w-7"
                    aria-label="Close live alerts"
                  >
                    <svg
                      className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {notifications.length > 0 ? (
                  <div className="notification-scrollbar max-h-[280px] space-y-2 overflow-y-auto pr-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="rounded-2xl border border-gray-200 bg-white/80 p-3 dark:border-gray-700 dark:bg-gray-800/70"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-lg ${getNotificationAccentClass(
                              notification.level
                            )}`}
                          ></span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {notification.title}
                                </p>
                                <p className="mt-1 inline-block min-w-[4.75rem] whitespace-nowrap text-xs tabular-nums text-gray-600 dark:text-gray-400">
                                  {notification.time}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveNotification(notification.key)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                aria-label={`Remove ${notification.title} notification`}
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <p className="mt-2 min-h-[2.5rem] break-words pr-1 text-xs leading-5 text-gray-700 dark:text-gray-300">
                              {notification.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">No pending alerts</p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Everything looks stable. New incidents will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
