import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useClerk, useAuth, useUser } from "@clerk/clerk-react";
import { Chart, registerables } from "chart.js";
import Navbar from "../Component/Navbar";
import "./Dashboard.css";
import { getProjects, addProject, deleteProject, pingUrl, getProjectLogs, getProjectUptime } from "../api/Api.js";
import { SYSTEM_THEME_QUERY, applyTheme, getResolvedTheme, getStoredThemePreference, getSystemTheme, persistThemePreference, } from "../lib/theme";
Chart.register(...registerables);
/* =====================================================
   PulseGuard  Uptime Monitor Dashboard (React Single File)
   Converted from original HTML/JS to React.
   Preserves design, animations, theme and functionality.
   ===================================================== */

const MONITOR_REFRESH_MS = 5000;
const AUTO_PING_STAGGER_MS = 250;
const AUTO_PING_BASE_INTERVAL_MS = 1200;
const AUTO_PING_CYCLE_BUFFER_MS = 800;
const MAX_ACTIVITY_POINTS = 40;
const PING_LOADING_MIN_MS = 450;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ALERT_LATENCY_THRESHOLD_MS = 1000;
const MONITOR_FETCH_RETRY_DELAYS_MS = [1000, 2000, 3000];
const MONITOR_FETCH_TIMEOUT_MS = 15000;
const MONITOR_UPTIME_TIMEOUT_MS = 10000;



/* ============= Skeleton Components ============= */

function SkeletonPulse() {
  return (
    <span style={{
      display: 'inline-block',
      background: 'linear-gradient(90deg, var(--tw-gradient-from, #e5e7eb) 25%, #f3f4f6 50%, #e5e7eb 75%)',
      backgroundSize: '600px 100%',
      animation: 'skeleton-shimmer 1.5s infinite',
      borderRadius: '6px',
    }} />
  );
}

function SkeletonStatCard() {
  return (
    <div className="stat-card">
      <div className="stat-card-head">
        <div className="skeleton-box" style={{ width: 36, height: 36, borderRadius: 10 }} />
        <div className="skeleton-box" style={{ width: 52, height: 20, borderRadius: 20 }} />
      </div>
      <div className="skeleton-box" style={{ width: '65%', height: 11, marginTop: 6 }} />
      <div className="skeleton-box" style={{ width: '45%', height: 32, marginTop: 4, borderRadius: 4 }} />
      <div className="skeleton-box" style={{ width: '85%', height: 11, marginTop: 4 }} />
    </div>
  );
}

function SkeletonMonitorRow() {
  return (
    <div className="reference-item px-4 py-4 md:px-5">
      <div className="flex items-start gap-4 lg:items-center">
        <div className="skeleton-box" style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
        <div className="min-w-0 flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div className="skeleton-box" style={{ width: '50%', height: 13 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="skeleton-box" style={{ width: 60, height: 20, borderRadius: 20 }} />
            <div className="skeleton-box" style={{ width: 48, height: 11, alignSelf: 'center' }} />
          </div>
          <div className="skeleton-box" style={{ width: '65%', height: 11 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
          <div className="skeleton-box" style={{ width: 55, height: 11 }} />
          <div className="skeleton-box" style={{ width: 40, height: 14 }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="reference-panel network-panel p-5 md:p-7 mb-8">
      <div className="network-header mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton-box" style={{ width: 90, height: 22, borderRadius: 20 }} />
          <div className="skeleton-box" style={{ width: 180, height: 18 }} />
          <div className="skeleton-box" style={{ width: 260, height: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="skeleton-box" style={{ width: 72, height: 34, borderRadius: 10 }} />
          <div className="skeleton-box" style={{ width: 62, height: 34, borderRadius: 10 }} />
          <div className="skeleton-box" style={{ width: 72, height: 34, borderRadius: 10 }} />
        </div>
      </div>
      <div className="skeleton-box" style={{ width: '100%', height: 160, borderRadius: 8 }} />
      <div className="network-stats-grid mt-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="section-stat network-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div className="skeleton-box" style={{ width: '55%', height: 11 }} />
            <div className="skeleton-box" style={{ width: '40%', height: 22 }} />
            <div className="skeleton-box" style={{ width: '100%', height: 6, borderRadius: 3 }} />
            <div className="skeleton-box" style={{ width: '80%', height: 11 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonHeaderHero() {
  return (
    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between animate-fade-in">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-3 rounded-full border border-gray-200/60 bg-white px-3 py-1.5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
          <div className="skeleton-box" style={{ width: 92, height: 12, borderRadius: 999 }} />
          <div className="hidden h-3 w-px bg-gray-300/50 sm:block dark:bg-white/[0.08]"></div>
          <div className="skeleton-box" style={{ width: 72, height: 12, borderRadius: 999 }} />
          <div className="hidden h-3 w-px bg-gray-300/50 sm:block dark:bg-white/[0.08]"></div>
          <div className="hidden sm:block">
            <div className="skeleton-box" style={{ width: 78, height: 12, borderRadius: 999 }} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="skeleton-box" style={{ width: 'min(460px, 78vw)', height: 56, borderRadius: 18 }} />
          <div className="skeleton-box" style={{ width: 'min(320px, 62vw)', height: 18, borderRadius: 10 }} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="skeleton-box" style={{ width: 148, height: 44, borderRadius: 12 }} />
      </div>
    </div>
  );
}


//

/* ============= Helpers ============= */
function getCssVar(name, fallback = '') {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function genHistory(count, upRate, recentDown = false) {
  const arr = [];
  for (let i = 0; i < count; i++) arr.push(Math.random() < upRate ? 'up' : 'down');
  if (recentDown) {
    arr[count - 1] = 'down';
    arr[count - 2] = 'down';
    arr[count - 3] = 'down';
  }
  return arr;
}

function getMonitorAgeInSeconds(createdAt, now) {
  const createdAtMs = new Date(createdAt).getTime();
  const nowMs = new Date(now).getTime();

  if (!Number.isFinite(createdAtMs) || !Number.isFinite(nowMs)) {
    return 0;
  }

  return Math.max(0, Math.floor((nowMs - createdAtMs) / 1000));
}

function formatMonitorAgeLabel(createdAt, now) {
  const ageInSeconds = getMonitorAgeInSeconds(createdAt, now);

  if (ageInSeconds < 60) {
    return `${ageInSeconds}s ago`;
  }

  const ageInMinutes = Math.floor(ageInSeconds / 60);

  if (ageInMinutes < 60) {
    return `${ageInMinutes}m ago`;
  }

  const ageInHours = Math.floor(ageInMinutes / 60);

  if (ageInHours < 24) {
    return `${ageInHours}h ago`;
  }

  const ageInDays = Math.floor(ageInSeconds / (ONE_DAY_MS / 1000));
  return `${ageInDays}d ago`;
}

function getWeeklyAddedCount(monitors, now) {
  const nowMs = new Date(now).getTime();

  return monitors.filter((monitor) => {
    const createdAtMs = new Date(monitor.createdAt).getTime();
    return Number.isFinite(createdAtMs) && nowMs - createdAtMs < ONE_DAY_MS * 7;
  }).length;
}


function generateChartData(range) {
  let points, label;
  if (range === '1h') { points = 30; label = i => `${(30 - i) * 2}m ago`; }
  else if (range === '24h') { points = 24; label = i => `${(24 - i)}h ago`; }
  else if (range === '7d') { points = 7; label = i => `${(7 - i)}d ago`; }
  else { points = 30; label = i => `${(30 - i)}d ago`; }

  const labels = [];
  const data = [];
  for (let i = 0; i < points; i++) {
    labels.push(label(i));
    const hasActivity = Math.random() > 0.05;
    if (hasActivity) {
      const base = 80 + Math.sin(i * 0.4) * 30 + Math.cos(i * 0.7) * 20;
      const spike = Math.random() > 0.85 ? Math.random() * 150 : 0;
      data.push(Math.max(20, Math.round(base + spike + (Math.random() - 0.5) * 40)));
    } else {
      data.push(0);
    }
  }
  if (data[data.length - 1] === 0) data[data.length - 1] = Math.floor(Math.random() * 100 + 80);
  return { labels, data };
}

function buildHistoryFromPrevious(previousHistory = [], nextStatus = 'up') {
  // Normalize status: only 'down' is down, everything else (up, warning, critical) is up
  const normalizedStatus = nextStatus === 'down' ? 'down' : 'up';
  if (!previousHistory.length) {
    return [...genHistory(39, normalizedStatus === 'up' ? 0.95 : 0.7), normalizedStatus];
  }

  const nextHistory = previousHistory.slice(-40);
  nextHistory.push(normalizedStatus);
  return nextHistory.slice(-40);
}

function appendPingLogEntry(previousLogs, nextEntry) {
  return [...previousLogs, nextEntry].slice(-MAX_ACTIVITY_POINTS);
}

function normalizeMonitorUrl(url) {
  const fallbackValue = String(url || '').trim();

  try {
    const parsedUrl = new URL(fallbackValue);
    parsedUrl.protocol = parsedUrl.protocol.toLowerCase();
    parsedUrl.hostname = parsedUrl.hostname.toLowerCase();
    parsedUrl.hash = '';

    if (parsedUrl.pathname.length > 1) {
      parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, '');
    }

    return parsedUrl.toString();
  } catch {
    return fallbackValue.toLowerCase().replace(/\/+$/, '');
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/* ============= Initial Mock Data ============= */
const initialMonitors = [
  { id: 1, name: 'Production API', url: 'https://api.pulseguard.io', type: 'api', interval: 5, status: 'up', createdAt: Date.now() - 45 * 1000, lastCheck: Date.now() - 45 * 1000, responseTime: 124, uptime: 99.98, history: genHistory(40, 0.97) },
  { id: 2, name: 'Marketing Site', url: 'https://www.pulseguard.io', type: 'website', interval: 5, status: 'up', createdAt: Date.now() - 32 * 1000, lastCheck: Date.now() - 32 * 1000, responseTime: 89, uptime: 99.99, history: genHistory(40, 0.99) },
  { id: 3, name: 'Admin Dashboard', url: 'https://admin.pulseguard.io', type: 'render', interval: 10, status: 'down', createdAt: Date.now() - 120 * 1000, lastCheck: Date.now() - 120 * 1000, responseTime: 0, uptime: 97.42, history: genHistory(40, 0.85, true) },
  { id: 4, name: 'Auth Service', url: 'https://auth.pulseguard.io', type: 'service', interval: 1, status: 'up', createdAt: Date.now() - 12 * 1000, lastCheck: Date.now() - 12 * 1000, responseTime: 56, uptime: 99.94, history: genHistory(40, 0.95) },
  { id: 5, name: 'Webhook Receiver', url: 'https://hooks.pulseguard.io', type: 'other', interval: 5, status: 'up', createdAt: Date.now() - 67 * 1000, lastCheck: Date.now() - 67 * 1000, responseTime: 211, uptime: 99.71, history: genHistory(40, 0.93) },
];

// Suppress unused-variable warning for mock data kept for reference
void initialMonitors;

function formatAlertTime(timestamp) {
  if (!Number.isFinite(timestamp)) {
    return 'Just now';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function sortMonitorAlerts(alerts) {
  return [...alerts].sort((first, second) => {
    const severityOrder = { critical: 0, warning: 1, info: 2, success: 3 };
    const levelDifference = (severityOrder[first.level] ?? 99) - (severityOrder[second.level] ?? 99);

    if (levelDifference !== 0) {
      return levelDifference;
    }

    return (second.timestamp ?? 0) - (first.timestamp ?? 0);
  });
}

function createMonitorAlerts(monitors) {
  const alerts = monitors.flatMap((monitor) => {
    const lastCheck = Number.isFinite(monitor.lastCheck) ? monitor.lastCheck : Date.now();

    // Server Down: Actual failure (no response, timeout, network error)
    if (monitor.status === 'down') {
      return [{
        key: `${monitor.id}-down`,
        monitorId: monitor.id,
        title: 'Server down',
        detail: `${monitor.name} is not responding to the latest health check.`,
        time: formatAlertTime(lastCheck),
        timestamp: lastCheck,
        level: 'critical',
      }];
    }

    // High Latency: Critical response time (> 1000ms but responding)
    if (monitor.status === 'critical') {
      return [{
        key: `${monitor.id}-latency`,
        monitorId: monitor.id,
        title: 'Critical latency',
        detail: `${monitor.name} responded in ${monitor.responseTime}ms. This is very slow.`,
        time: formatAlertTime(lastCheck),
        timestamp: lastCheck,
        level: 'warning',
      }];
    }

    // Elevated Latency: Warning response time (500-1000ms but responding)
    if (monitor.status === 'warning') {
      return [{
        key: `${monitor.id}-warning`,
        monitorId: monitor.id,
        title: 'High latency',
        detail: `${monitor.name} responded in ${monitor.responseTime}ms. Performance is degraded.`,
        time: formatAlertTime(lastCheck),
        timestamp: lastCheck,
        level: 'info',
      }];
    }

    return [];
  });

  return sortMonitorAlerts(alerts);
}

/* ============= Sub-components ============= */

function HeaderHero({ totalCount, liveClock, userName }) {
  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 animate-fade-in">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-white dark:bg-white/[0.02] rounded-full border border-gray-200/60 dark:border-white/[0.06] shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 hidden sm:inline">
              Live monitoring
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 sm:hidden">
              Live
            </span>
          </div>

          <div className="w-px h-3 bg-gray-300/50 dark:bg-white/[0.08] hidden sm:block"></div>

          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-[11px] font-mono font-medium text-gray-600 dark:text-gray-400 tabular-nums whitespace-nowrap">{liveClock}</span>
          </div>

          <div className="w-px h-3 bg-gray-300/50 dark:bg-white/[0.08] hidden sm:block"></div>

          <div className="hidden sm:flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-gray-950"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 ring-1 ring-white dark:ring-gray-950"></div>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">99.9% Uptime</span>
          </div>
        </div>

        <div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-x">
              {userName || "Admin"}
            </span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1.5 flex-wrap">
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            Monitoring{' '}
            <span className="relative inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-gray-100 dark:bg-white/[0.05] rounded-md text-gray-900 dark:text-white font-bold text-sm tabular-nums border border-gray-200/60 dark:border-white/[0.06]">
              {totalCount}
            </span>{' '}
            endpoints across the globe
          </p>
        </div>
      </div>
    </div>
  );
}

function StatsCards({ total, up, down, avg, weeklyAdded, loadingProjects }) {
  const [liveAvg, setLiveAvg] = useState(avg);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLiveAvg(avg);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [avg]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLiveAvg(() => {
        if (avg <= 0) return 0;

        const variance = Math.max(1, Math.round(avg * 0.04));
        const nextValue = avg + Math.floor(Math.random() * (variance * 2 + 1)) - variance;
        return Math.max(0, nextValue);
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [avg]);


  if (loadingProjects) {
    return (
      <div className="stats-shell grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="stats-shell grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

      {/* 1. Total Monitors Card */}
      <div className="stat-card animate-slide-up group" style={{ animationDelay: '0.05s' }}>
        <div className="stat-card-head">
          <div className="stat-card-icon blue shadow-lg shadow-blue-500/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <span className="stat-card-pill backdrop-blur-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5"></span>
            Fleet
          </span>
        </div>
        <div className="stat-card-label tracking-widest">Total Monitors</div>
        <div className="stat-card-value !text-blue-500 tabular-nums">{total}</div>
        <div className="stat-card-note flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-7 7l7-7 7 7" />
            </svg>
            {/* FIX: was "+${weeklyAdded}" but weeklyAdded is already a number */}
            <strong>{`+${weeklyAdded}`}</strong>
          </span>
          <span className="text-stat-note">added this week</span>
        </div>
      </div>

      {/* 2. Online/Healthy Card */}
      <div className="stat-card animate-slide-up group" style={{ animationDelay: '0.1s' }}>
        <div className="stat-card-head">
          <div className="stat-card-icon green shadow-lg shadow-green-500/10">
            <span className="pulse-dot up"></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="stat-card-pill backdrop-blur-sm border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              Healthy
            </span>
            <div className="hidden sm:flex items-end gap-0.5 h-5">
              <span className="w-0.5 h-2 bg-green-300 rounded-full"></span>
              <span className="w-0.5 h-4 bg-green-400 rounded-full"></span>
              <span className="w-0.5 h-3 bg-green-300 rounded-full"></span>
              <span className="w-0.5 h-5 bg-green-500 rounded-full"></span>
              <span className="w-0.5 h-3 bg-green-400 rounded-full"></span>
            </div>
          </div>
        </div>
        <div className="stat-card-label tracking-widest">Online</div>
        <div className="stat-card-value bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text !text-green-500 text-transparent tabular-nums">
          {up}
        </div>
        <div className="stat-card-note flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span className="text-xs font-bold text-green-700 dark:text-green-300">100%</span>
          </span>
          <span className="text-stat-note">All systems nominal</span>
        </div>
      </div>

      {/* 3. Down/Alert Card */}
      <div className="stat-card animate-slide-up group" style={{ animationDelay: '0.2s' }}>
        <div className="stat-card-head">
          <div className="stat-card-icon red shadow-lg shadow-red-500/10">
            <span className="pulse-dot down"></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="stat-card-pill backdrop-blur-sm border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
              Alert
            </span>
            {down > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-wider text-red-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Active
              </span>
            )}
          </div>
        </div>
        <div className="stat-card-label tracking-widest">Down</div>
        <div className="stat-card-value !text-red-500 tabular-nums">{down}</div>
        <div className="stat-card-note flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold
        ${down > 0
              ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              : 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${down > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
            {down > 0 ? `${down} active` : 'All clear'}
          </span>
          <span className="text-stat-note">
            incident{down === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* 4. Latency/Avg Response Card */}
      {/* FIX: "1 2%" typo → "12%" (was appearing twice) */}
      <div className="stat-card animate-slide-up group" style={{ animationDelay: '0.15s' }}>
        <div className="stat-card-head">
          <div className="stat-card-icon purple shadow-lg shadow-purple-500/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="stat-card-pill backdrop-blur-sm border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Latency
            </span>
            <div className="hidden sm:flex items-end gap-0.5 h-5">
              <span className="w-0.5 h-2 bg-purple-300 rounded-full"></span>
              <span className="w-0.5 h-3 bg-purple-400 rounded-full"></span>
              <span className="w-0.5 h-2 bg-purple-300 rounded-full"></span>
              <span className="w-0.5 h-4 bg-purple-500 rounded-full"></span>
              <span className="w-0.5 h-3 bg-purple-400 rounded-full"></span>
              <span className="w-0.5 h-2.5 bg-purple-300 rounded-full"></span>
            </div>
          </div>
        </div>
        <div className="stat-card-label tracking-widest">Avg Response</div>
        <div className="stat-card-value flex items-baseline gap-1">
          <span className="!text-purple-500 tabular-nums">{liveAvg}</span>
          <span className="text-lg font-semibold text-gray-400 dark:text-gray-500">ms</span>
          <span className="inline-flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded-full bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-[0.65rem] font-bold text-green-600 dark:text-green-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-7 7l7-7 7 7" />
            </svg>
            {/* FIX: was "1 2%" — removed the erroneous space */}
            12%
          </span>
        </div>
        <div className="stat-card-note flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4v16h18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-8 4 4 5-7" />
          </svg>
          {/* FIX: was "1 2%" — removed the erroneous space */}
          <strong className="text-green-600 dark:text-green-400">12%</strong>
          <span className="text-stat-note">faster than last week</span>
        </div>
      </div>
    </div>
  );
}

function ActivityChartV2({ theme, currentRange, onChangeRange, realLogs, monitorName, onRefresh }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const rangeRef = useRef(currentRange);
  const refreshPending = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeAction, setActiveAction] = useState("resume");
  const [isCompactChart, setIsCompactChart] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 640;
  });

  // FIX: getDynamicStats now handles '1h' range correctly (was keyed as 'Refresh')
  // and fallback ranges include avgPing/maxPing/minPing to avoid undefined renders
  const getDynamicStats = () => {
    if (realLogs && realLogs.length > 0) {
      const total = realLogs.length;
      const failed = realLogs.filter(l => l.status !== 'up').length;
      const failureRate = total > 0 ? ((failed / total) * 100).toFixed(2) : 0;
      const uptime = total > 0 ? (100 - parseFloat(failureRate)).toFixed(2) : 100;

      const upLogs = realLogs.filter(l => l.status === 'up');
      let avgPing = 0, maxPing = 0, minPing = 0;
      if (upLogs.length > 0) {
        const times = upLogs.map(l => l.responseTime);
        avgPing = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        maxPing = Math.max(...times);
        minPing = Math.min(...times);
      }

      return {
        label: `Latest ${total} pings`,
        cadence: 'Current response with continuous ping streaming',
        uptime: `${uptime}%`,
        totalPings: total.toLocaleString(),
        failed: failed,
        failureRate: `${parseFloat(failureRate)}%`,
        avgPing: `${avgPing}ms`,
        maxPing: `${maxPing}ms`,
        minPing: `${minPing}ms`,
        delta: 'Active'
      };
    }

    // FIX: '1h' key was incorrectly written as 'Refresh' — caused undefined crash
    // FIX: added avgPing/maxPing/minPing to all fallback entries
    const fallbackStats = {
      '1h': {
        label: 'Last 60 minutes',
        cadence: 'Samples every 2 minutes',
        uptime: '99.87%',
        totalPings: '14,328',
        failed: 19,
        failureRate: '0.13%',
        avgPing: '112ms',
        maxPing: '340ms',
        minPing: '48ms',
        delta: '+12%'
      },
      '24h': {
        label: 'Last 24 hours',
        cadence: 'Samples every 1 hour',
        uptime: '99.92%',
        totalPings: '86,412',
        failed: 42,
        failureRate: '0.05%',
        avgPing: '98ms',
        maxPing: '410ms',
        minPing: '41ms',
        delta: '+8%'
      },
      '7d': {
        label: 'Last 7 days',
        cadence: 'Daily trend sampling',
        uptime: '99.95%',
        totalPings: '601,280',
        failed: 76,
        failureRate: '0.01%',
        avgPing: '105ms',
        maxPing: '520ms',
        minPing: '38ms',
        delta: '+4%'
      },
      '30d': {
        label: 'Last 30 days',
        cadence: 'Daily aggregate view',
        uptime: '99.97%',
        totalPings: '2.4M',
        failed: 103,
        failureRate: '0.004%',
        avgPing: '101ms',
        maxPing: '490ms',
        minPing: '35ms',
        delta: '+2%'
      }
    };

    // Fallback to '1h' if range is somehow unknown
    return fallbackStats[currentRange] || fallbackStats['1h'];
  };

  const activityMeta = getDynamicStats();

  useEffect(() => {
    rangeRef.current = currentRange;
  }, [currentRange]);

  const handleManualRefresh = useCallback(() => {
    setIsPaused(false);
    setActiveAction("resume");
    refreshPending.current = true;
    onRefresh?.();
  }, [onRefresh]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleResize = () => {
      setIsCompactChart(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buildChart = useCallback((logsOverride) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    let labels, data;
    if (logsOverride && logsOverride.length > 0) {
      labels = logsOverride.map(l => new Date(l.timestamp).toLocaleTimeString());
      data = logsOverride.map(l => l.status === 'up' ? l.responseTime : 0);
    } else {
      ({ labels, data } = generateChartData(rangeRef.current));
    }
    const styles = getComputedStyle(document.documentElement);
    const chartLine = getCssVar('--chart-line', 'rgb(16 185 129)');
    const chartFillStart = getCssVar('--chart-fill-start', 'rgb(16 185 129 / 0.28)');
    const chartFillMid = getCssVar('--chart-fill-mid', 'rgb(16 185 129 / 0.10)');
    const chartFillEnd = getCssVar('--chart-fill-end', 'rgb(16 185 129 / 0)');
    const chartGap = styles.getPropertyValue('--chart-gap').trim();
    const chartGrid = styles.getPropertyValue('--chart-grid').trim();
    const chartTicks = styles.getPropertyValue('--chart-ticks').trim();
    const tooltipBg = styles.getPropertyValue('--tooltip-bg').trim();
    const tooltipTitle = styles.getPropertyValue('--tooltip-title').trim();
    const tooltipBody = styles.getPropertyValue('--tooltip-body').trim();
    const tooltipBorder = styles.getPropertyValue('--tooltip-border').trim();
    const pageBase = styles.getPropertyValue('--page-base').trim();
    const xTickLimit = isCompactChart ? 4 : 8;
    const xTickFontSize = isCompactChart ? 9 : 10;
    const yTickFontSize = isCompactChart ? 9 : 10;
    const yTickLimit = isCompactChart ? 6 : 8;

    const grad = ctx.createLinearGradient(0, 0, 0, 250);
    grad.addColorStop(0, chartFillStart);
    grad.addColorStop(0.5, chartFillMid);
    grad.addColorStop(1, chartFillEnd);

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Response (ms)',
          data,
          borderColor: chartLine,
          backgroundColor: grad,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: chartLine,
          pointHoverBorderColor: pageBase,
          pointHoverBorderWidth: 2,
          segment: {
            borderColor: context => {
              const start = context.p0.parsed.y;
              const end = context.p1.parsed.y;
              if (start === 0 || end === 0) return chartGap;
              return chartLine;
            }
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: isCompactChart ? 4 : 8,
            right: isCompactChart ? 2 : 8,
            bottom: 0,
            left: isCompactChart ? 0 : 4
          }
        },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg,
            titleColor: tooltipTitle,
            bodyColor: tooltipBody,
            borderColor: tooltipBorder,
            borderWidth: 1,
            padding: 12,
            titleFont: { family: 'JetBrains Mono', size: 11 },
            bodyFont: { family: 'Inter', weight: '600' },
            callbacks: {
              label: context => context.parsed.y === 0 ? 'No activity' : `${context.parsed.y} ms`
            }
          }
        },
        scales: {
          x: {
            grid: { color: chartGrid },
            ticks: {
              color: chartTicks,
              font: { size: xTickFontSize, family: 'JetBrains Mono' },
              maxTicksLimit: xTickLimit,
              autoSkip: true,
              maxRotation: isCompactChart ? 28 : 0,
              minRotation: isCompactChart ? 28 : 0,
              padding: isCompactChart ? 6 : 8
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: chartGrid },
            ticks: {
              color: chartTicks,
              font: { size: yTickFontSize, family: 'JetBrains Mono' },
              maxTicksLimit: yTickLimit,
              padding: isCompactChart ? 4 : 8,
              callback: value => `${value}ms`
            }
          }
        }
      }
    });
  }, [isCompactChart]);

  useEffect(() => {
    buildChart(realLogs && realLogs.length > 0 ? realLogs : null);
  }, [currentRange, theme, buildChart]);

  useEffect(() => {
    if (!chartRef.current || !realLogs || realLogs.length === 0) {
      return;
    }

    chartRef.current.data.labels = realLogs.map((log) => new Date(log.timestamp).toLocaleTimeString());
    chartRef.current.data.datasets[0].data = realLogs.map((log) => (log.status === 'up' ? log.responseTime : 0));

    if (!isPaused || refreshPending.current) {
      chartRef.current.update('none');
      refreshPending.current = false;
    }
  }, [realLogs, isPaused]);

  useEffect(() => {
    if (realLogs && realLogs.length > 0) {
      return undefined;
    }

    const id = setInterval(() => {
      const chart = chartRef.current;
      if (chart && rangeRef.current === '1h') {
        const nextValue = Math.random() > 0.05 ? Math.floor(80 + Math.random() * 120) : 0;
        chart.data.datasets[0].data.shift();
        chart.data.datasets[0].data.push(nextValue);
        chart.update('none');
      }
    }, 4000);

    return () => clearInterval(id);
  }, [realLogs]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="reference-panel network-panel p-5 md:p-7 mb-8 animate-fade-in group">
      <div className="network-header mb-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="network-kicker">
              <span className="network-kicker-dot"></span>
              Live overview
            </span>
            <span className="network-status-badge">
              <span className="network-status-ping"></span>
              Streaming
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="network-title">
                {monitorName ? `${monitorName} Activity` : 'Network Activity'}
              </h3>
              <span className="network-window-chip">{activityMeta.label}</span>
            </div>
            <p className="network-subtitle">
              Live overview shows the current response status, while streaming keeps this graph updated continuously with fresh pings.
            </p>
          </div>
        </div>

        <div className="reference-toolbar network-toolbar flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          {/* Refresh */}
          <button
            onClick={handleManualRefresh}
            className="group relative flex items-center gap-1.5 py-2 px-3 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all duration-200 active:scale-95"
            title="Refresh data"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-wide">Refresh</span>
          </button>

          <div className="w-px h-4 bg-slate-700/70 mx-0.5"></div>

          {/* Pause */}
          <button
            onClick={() => {
              setIsPaused(true);
              setActiveAction("pause");
            }}
            className={`group relative flex items-center gap-1.5 py-2 px-3 rounded-lg transition-all duration-200 active:scale-95 ${activeAction === "pause"
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/20 border border-transparent"
              }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-wide">Pause</span>
          </button>

          {/* Resume */}
          <button
            onClick={() => {
              setIsPaused(false);
              setActiveAction("resume");
            }}
            className={`group relative flex items-center gap-1.5 py-2 px-3 rounded-lg transition-all duration-200 active:scale-95 ${activeAction === "resume"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent"
              }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-wide">Resume</span>
          </button>
        </div>
      </div>

      <div className="reference-item network-chart-shell">
        <div className="network-chart-grid" aria-hidden="true"></div>

        <div className="network-chart-topbar">
          <div className="network-legend">
            <span className="network-legend-item">
              <span className="network-legend-swatch active"></span>
              Response time
            </span>
            <span className="network-legend-item">
              <span className="network-legend-swatch gap"></span>
              No activity
            </span>
          </div>
          <div className="network-cadence">{activityMeta.cadence}</div>
        </div>

        <div className="network-chart-canvas">
          <canvas ref={canvasRef} id="activityChart"></canvas>
        </div>

        <div className="network-chart-bottom">
          <div className="network-live-note">
            <span className="network-live-dot"></span>
            Streaming new ping data every few seconds
          </div>
          <div className="network-axis-note">Latency in milliseconds</div>
        </div>
      </div>

      <div className="network-stats-grid mt-5">
        <div className="section-stat network-stat-card">
          <div className="network-stat-top">
            <div className="network-stat-label">Uptime</div>
            <div className="network-stat-dot green"></div>
          </div>
          <div className="network-stat-value text-green-500">{activityMeta.uptime}</div>
          <div className="network-stat-progress">
            <div className="network-stat-progress-bar green" style={{ width: activityMeta.uptime }}></div>
          </div>
          <p className="network-stat-note">Steady health across the selected time window</p>
        </div>

        <div className="section-stat network-stat-card">
          <div className="network-stat-top">
            <div className="network-stat-label">Latency</div>
            <div className="network-stat-dot blue"></div>
          </div>
          <div className="network-stat-value text-blue-500">
            {activityMeta.avgPing} <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase opacity-70">Avg</span>
          </div>
          <p className="network-stat-note">
            Max: <span className="text-slate-600 dark:text-slate-300 font-bold">{activityMeta.maxPing}</span> &nbsp;&bull;&nbsp; Min: <span className="text-slate-600 dark:text-slate-300 font-bold">{activityMeta.minPing}</span>
          </p>
        </div>

        <div className="section-stat network-stat-card">
          <div className="network-stat-top">
            <div className="network-stat-label">Failed</div>
            <div className="network-stat-dot red"></div>
          </div>
          <div className="network-stat-value text-red-500">
            {activityMeta.failed}
          </div>
          <p className="network-stat-note">
            <span className="text-red-500">
              {activityMeta.failureRate}
            </span>{' '}
            failure rate
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Portal dropdown — renders at document.body, immune to overflow:hidden ── */
function MobileDropdownPortal({ open, buttonRef, onClose, children }) {
  const [style, setStyle] = useState({});

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setStyle({
      position: 'fixed',
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
      zIndex: 9999,
    });
  }, [open, buttonRef]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setStyle((prev) => ({ ...prev, top: rect.bottom + 6, right: window.innerWidth - rect.right }));
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('scroll', onScroll, true);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, buttonRef, onClose]);

  if (!open) return null;
  return createPortal(
    <div style={style}>{children}</div>,
    document.body
  );
}

function MonitorRow({ m, onPing, onDelete, pingLoadingId, deletingMonitorId, isSelected, onSelect, liveNow }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuPingPending, setMenuPingPending] = useState(false);
  const [menuPingStarted, setMenuPingStarted] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const handleOutsideClick = (event) => {
      const clickedButton = mobileButtonRef.current && mobileButtonRef.current.contains(event.target);
      const clickedMenu = mobileMenuRef.current && mobileMenuRef.current.contains(event.target);
      if (!clickedButton && !clickedMenu) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!menuPingPending) return;

    if (pingLoadingId === m.id) {
      if (!menuPingStarted) {
        setMenuPingStarted(true);
      }
      return;
    }

    if (!menuPingStarted) return;

    setMobileMenuOpen(false);
    setMenuPingPending(false);
    setMenuPingStarted(false);
  }, [menuPingPending, menuPingStarted, pingLoadingId, m.id]);

  return (
    <div
      className={`reference-item group relative overflow-visible px-4 py-4 md:px-5 ${isSelected ? 'ring-1 ring-emerald-400/40' : ''}`}
      onClick={() => onSelect(m.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(m.id);
        }
      }}
    >
      <div className="flex items-start gap-4 lg:items-center">
        <div className="reference-icon-shell flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] lg:h-12 lg:w-12">
          <span className={`pulse-dot ${m.status}`}></span>
        </div>

        <div className="monitor-main min-w-0 flex-1 pr-[17px] sm:pr-28 lg:pr-6">
          <div className="monitor-name text-sm font-semibold text-accent-black" title={m.name}>{m.name}</div>
          <div className="monitor-meta mt-1 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[9px] sm:text-[11px] font-semibold ${m.status === 'up'
              ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
              : m.status === 'warning'
                ? 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
                : m.status === 'critical'
                  ? 'bg-orange-500/10 text-orange-700 border-orange-500/20'
                  : 'bg-accent-red/10 text-accent-red border-accent-red/20'
              }`}>
              {m.status === 'up' ? 'HEALTHY' : m.status === 'warning' ? 'WARNING' : m.status === 'critical' ? 'CRITICAL' : 'DOWN'}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400">
              {formatMonitorAgeLabel(m.createdAt || m.lastCheck, liveNow)}
            </span>
            <span className="hidden lg:inline text-xs font-medium text-gray-400">{m.uptime.toFixed(2)}% uptime</span>
          </div>
          <a
            href={m.url}
            target="_blank"
            rel="noreferrer"
            title={m.url}
            onClick={(e) => e.stopPropagation()}
            className="monitor-link mt-2 text-xs font-medium text-gray-500 hover:text-accent-blue"
          >
            {m.url}
          </a>
        </div>

        {/* Status bar / history */}
        <div className="hidden xl:block w-44">
          <div className="status-bar" title="Last 40 checks">
            {m.history.map((h, idx) => (
              <div key={idx} className={h === 'up' ? 'status-up' : 'status-down'} title={h.toUpperCase()}></div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-400 font-mono mt-1">
            <span>40 checks ago</span>
            <span>now</span>
          </div>
        </div>

        {/* Stats */}
        <div className="ml-auto flex items-start gap-2 sm:gap-3">
          <div className="option-menu absolute top-[59px] right-[10px] z-10 min-w-[88px] text-right max-[480px]:right-[9px] lg:static lg:top-auto lg:right-auto">
            <div id={`option-menu-${m.id}`} className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-mono">Response</div>
            <div className={`text-xs md:text-sm font-semibold ${m.status === 'down' ? 'text-accent-red' : 'text-slate-700 dark:text-white'}`}>
              {m.status === 'down' ? '—' : `${m.responseTime}ms`}
            </div>
          </div>

          <div className="relative lg:hidden">
            <button
              ref={mobileButtonRef}
              type="button"
              aria-label={`Open actions for ${m.name}`}
              aria-expanded={mobileMenuOpen}
              onClick={(event) => {
                event.stopPropagation();
                setMobileMenuOpen((current) => !current);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-sky-50/90 text-slate-600 shadow-sm transition hover:bg-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="5" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="12" cy="19" r="1.8" />
              </svg>
            </button>

            <MobileDropdownPortal open={mobileMenuOpen} buttonRef={mobileButtonRef} onClose={() => setMobileMenuOpen(false)}>
              <div
                ref={mobileMenuRef}
                className="min-w-[160px] overflow-hidden rounded-2xl border border-gray-200 bg-white/95 p-1.5 shadow-card backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/95"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuPingPending(true);
                    setMenuPingStarted(false);
                    onPing(m.id);
                  }}
                  disabled={pingLoadingId === m.id}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-violet-600 transition hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10 disabled:opacity-60"
                >
                  <svg className={`h-4 w-4 ${pingLoadingId === m.id ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {pingLoadingId === m.id ? 'Pinging...' : 'Ping'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onDelete(m.id);
                  }}
                  disabled={deletingMonitorId === m.id}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                >
                  <svg className={`h-4 w-4 ${deletingMonitorId === m.id ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 11v6" />
                  </svg>
                  {deletingMonitorId === m.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </MobileDropdownPortal>
          </div>
        </div>

        {/* Hover actions */}
        <div className="hidden lg:flex items-center gap-2 transition-all duration-200 pointer-events-none translate-x-2 opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:translate-x-0 lg:group-hover:opacity-100">
          <button onClick={(event) => { event.stopPropagation(); onPing(m.id); }} disabled={pingLoadingId === m.id} className="reference-soft-button inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-60">
            <svg className={`h-3.5 w-3.5 ${pingLoadingId === m.id ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {pingLoadingId === m.id ? 'Pinging...' : 'Ping'}
          </button>
          <button
            onClick={(event) => { event.stopPropagation(); onDelete(m.id); }}
            disabled={deletingMonitorId === m.id}
            className="reference-danger-button inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-60"
          >
            <svg className={`h-3.5 w-3.5 ${deletingMonitorId === m.id ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 11v6" />
            </svg>
            {deletingMonitorId === m.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MonitorsList({ monitors, search, filter, onSearch, onFilter, onPing, onDelete, onAddMonitor, onPingLoadingId, deletingMonitorId, selectedMonitorId, onSelectMonitor, liveNow }) {
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return monitors.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(s) || m.url.toLowerCase().includes(s);
      const matchFilter = filter === 'all' || m.status === filter;
      return matchSearch && matchFilter;
    });
  }, [monitors, search, filter]);

  return (
    <div className="reference-panel overflow-visible animate-fade-in">
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Monitor Directory
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-gray-800 dark:text-gray-100">
              Your Monitors
            </span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Click any monitor to view details
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative group/search">
            <input
              id="searchInput"
              type="text"
              placeholder="Search monitors..."
              value={search}
              onChange={e => onSearch(e.target.value)}
              className="reference-input pl-10 pr-4 py-3 text-sm w-full sm:w-56 
            focus:border-blue-400/50 dark:focus:border-blue-500/30 
            focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-500/5
            placeholder:text-gray-400 dark:placeholder:text-gray-600
            transition-all duration-300"
            />
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-3.5 
            transition-colors duration-300 group-focus-within/search:text-blue-500"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Select */}
          {/* FIX: emoji characters were corrupted (ðŸŸ¢ / ðŸ"´) — replaced with correct Unicode */}
          <div className="relative">
            <select
              id="filterStatus"
              value={filter}
              onChange={e => onFilter(e.target.value)}
              className="reference-input px-4 py-3 text-sm w-full sm:w-40 appearance-none cursor-pointer
            focus:border-blue-400/50 dark:focus:border-blue-500/30
            focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-500/5
            transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="up">🟢 Up</option>
              <option value="down">🔴 Down</option>
            </select>
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute right-4 top-3.5 pointer-events-none transition-transform duration-300"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 md:mx-8 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

      {/* Monitor List */}
      {filtered.length > 0 ? (
        <div id="monitorsList" className="px-6 md:px-8 pb-24 md:pb-28 pt-4">
          <div className="space-y-2">
            {filtered.map(m => (
              <MonitorRow
                key={m.id}
                m={m}
                onPing={onPing}
                onDelete={onDelete}
                pingLoadingId={onPingLoadingId}
                deletingMonitorId={deletingMonitorId}
                isSelected={selectedMonitorId === m.id}
                onSelect={onSelectMonitor}
                liveNow={liveNow}
              />
            ))}
          </div>
        </div>
      ) : (
        <div id="emptyState" className="p-16 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400 dark:text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-950 border-2 border-white dark:border-gray-900 shadow-md flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No monitors found</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            Try a different filter or add a new monitor to get started.
          </p>
          <button
            onClick={onAddMonitor}
            className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-xl border border-green-500/30 bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-green-600 hover:shadow-md hover:shadow-green-500/20 active:scale-[0.98]"
          >
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition duration-300 group-hover:opacity-100"></div>
            <svg className="relative w-4 h-4 !text-white transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="relative !text-white">Add Monitor</span>
          </button>
        </div>
      )}
    </div>
  );
}

function AddMonitorModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const interval = 5;
  const defaultMonitorSubTypes = {
    api: 'rest',
    website: 'static',
    service: 'database',
    render: 'static-render',
    other: 'tcp',
  };
  const [monitorType, setMonitorType] = useState('api');
  const [monitorSubType, setMonitorSubType] = useState(defaultMonitorSubTypes.api);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleMonitorTypeChange = (nextType) => {
    setMonitorType(nextType);
    setMonitorSubType(defaultMonitorSubTypes[nextType] || defaultMonitorSubTypes.api);
  };

  const reset = () => {
    setName('');
    setUrl('');
    setMonitorType('api');
    setMonitorSubType(defaultMonitorSubTypes.api);
    setModalError('');
    setSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);
    await onSubmit({ name, url, interval, type: monitorType, subType: monitorSubType }, setModalError);
    setSubmitting(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div id="modal" className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="glass-strong w-full max-w-md rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center shadow-lg shadow-accent-green/20 dark:shadow-accent-green/10 ring-1 ring-accent-green/20 dark:ring-accent-green/10">
                  <svg
                    className="w-5 h-5 text-ink-900 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                  New Monitor
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                  Track a new endpoint
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-white p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form id="addForm" className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-800/70 dark:text-gray-300 font-medium mb-2">Name</label>
              <input
                required
                type="text"
                placeholder="My Production API"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-ink-700/50 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-accent-green/50 transition"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-800/70 dark:text-gray-300 font-medium mb-2">URL</label>
              <input
                required
                type="url"
                placeholder="https://api.example.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full bg-ink-700/50 border border-white/5 rounded-lg px-4 py-2.5 text-sm font-mono focus:border-accent-green/50 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-800/70 dark:text-gray-300 font-medium mb-2">
                Type
              </label>
              <div className="flex gap-2">
                <select
                  value={monitorType}
                  onChange={(e) => handleMonitorTypeChange(e.target.value)}
                  className="w-24 bg-ink-700/50 border border-white/5 rounded-lg px-3 py-2.5 text-xs focus:border-accent-green/50 transition"
                >
                  <option value="api">API</option>
                  <option value="website">Website</option>
                  <option value="service">Service</option>
                  <option value="render">Render</option>
                  <option value="other">Other</option>
                </select>

                <div className="flex-1">
                  <select
                    value={monitorSubType}
                    onChange={(e) => setMonitorSubType(e.target.value)}
                    className="w-full bg-ink-700/50 border border-white/5 rounded-lg px-3 py-2.5 text-xs focus:border-accent-green/50 transition"
                  >
                    {monitorType === 'api' && (
                      <>
                        <option value="rest">REST API</option>
                        <option value="graphql">GraphQL</option>
                        <option value="soap">SOAP</option>
                        <option value="grpc">gRPC</option>
                        <option value="websocket">WebSocket</option>
                        <option value="custom-api">Custom API…</option>
                      </>
                    )}
                    {monitorType === 'website' && (
                      <>
                        <option value="static">Static Site</option>
                        <option value="spa">Single Page App</option>
                        <option value="ssr">Server Rendered</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="blog">Blog / CMS</option>
                        <option value="custom-web">Custom Web…</option>
                      </>
                    )}
                    {monitorType === 'service' && (
                      <>
                        <option value="database">Database</option>
                        <option value="cache">Cache / Redis</option>
                        <option value="queue">Message Queue</option>
                        <option value="storage">File Storage</option>
                        <option value="mail">Email Service</option>
                        <option value="custom-svc">Custom Service…</option>
                      </>
                    )}
                    {monitorType === 'render' && (
                      <>
                        <option value="static-render">Static Render</option>
                        <option value="dynamic-render">Dynamic Render</option>
                        <option value="ssr-render">SSR Render</option>
                        <option value="isr-render">ISR Render</option>
                        <option value="custom-render">Custom Render…</option>
                      </>
                    )}
                    {monitorType === 'other' && (
                      <>
                        <option value="tcp">TCP Port</option>
                        <option value="dns">DNS Check</option>
                        <option value="ssl">SSL Certificate</option>
                        <option value="ping">Ping / ICMP</option>
                        <option value="custom-other">Custom Other…</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {modalError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {modalError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="w-full sm:flex-1 order-2 sm:order-1 px-4 py-2.5 border border-white/10 rounded-lg text-sm font-medium 
      hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 order-1 sm:order-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 bg-green-500 rounded-lg text-sm font-medium 
      hover:bg-green-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] !text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Saving...
                  </>
                ) : 'Create Monitor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ open, monitorName, deleting, onClose, onConfirm }) {
  useEffect(() => {
    if (!open || deleting) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, deleting, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={() => { if (!deleting) onClose(); }}
      ></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[2rem] bg-white px-6 py-7 text-center shadow-card-hover animate-fade-in dark:bg-gray-900">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/15">
            <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.5 20h15a2 2 0 001.71-3.14l-7.5-13a2 2 0 00-3.42 0z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-slate-700 dark:text-white">
            Delete Monitor?
          </h3>
          <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-300">
            {monitorName ? <>You are deleting <span className="font-semibold text-slate-700 dark:text-white">{monitorName}</span>.</> : 'You are deleting this monitor.'}
          </p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-400">
            This action cannot be undone.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-base font-semibold !text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {deleting ? (
                <>
                  <svg className="h-4 w-4 animate-spin !text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="!text-white">Deleting...</span>
                </>
              ) : <span className="!text-white">Delete</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, visible }) {
  const normalizedMessage = String(message || '').toLowerCase();
  const isError =
    normalizedMessage.includes('fail') ||
    normalizedMessage.includes('error') ||
    normalizedMessage.includes('down');

  return (
    <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <div
        id="toast"
        className={`flex items-center justify-center gap-3 
          px-5 py-3.5 rounded-2xl shadow-card border backdrop-blur-md
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95'}
          bg-white/90 border-gray-200 dark:bg-gray-900/95 dark:border-gray-700
          text-gray-800 dark:text-gray-100 min-w-[90px] max-w-[90vw] sm:max-w-md w-max pointer-events-auto`}
      >
        <div className={`shrink-0 w-2.5 h-2.5 rounded-full ${isError ? 'bg-rose-500 shadow-lg shadow-rose-500/30' : 'bg-emerald-500 shadow-lg shadow-emerald-500/30'}`}></div>
        <span id="toastMsg" className="text-sm font-semibold truncate text-center">{message}</span>
      </div>
    </div>
  );
}

/* ============= Main App ============= */
function PulseGuardDashboard() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { openSignIn } = useClerk();

  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());
  const [themePreference, setThemePreference] = useState(() => getStoredThemePreference());
  const theme = getResolvedTheme(themePreference) ?? systemTheme;

  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
    const handleChange = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    persistThemePreference(themePreference);
  }, [theme, themePreference]);

  const toggleTheme = useCallback(() => {
    setThemePreference((previous) => {
      const currentTheme = getResolvedTheme(previous);
      return currentTheme === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const [monitors, setMonitors] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [monitorLoadMessage, setMonitorLoadMessage] = useState('Loading your monitors from database...');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMonitorId, setSelectedMonitorId] = useState(null);

  const [pingLogsByMonitor, setPingLogsByMonitor] = useState({});
  const [pingLoadingId, setPingLoadingId] = useState(null);
  const [deletingMonitorId, setDeletingMonitorId] = useState(null);
  const [deleteConfirmMonitor, setDeleteConfirmMonitor] = useState(null);
  const activePingIdsRef = useRef(new Set());
  const activePingTasksRef = useRef(new Map());
  const pingLoadingStartedAtRef = useRef(0);
  const pingLoadingClearTimerRef = useRef(null);
  const fetchMonitorsRequestIdRef = useRef(0);
  const monitorsRef = useRef([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimerRef = useRef(null);
  const showToast = useCallback((msg) => {
    setToast({ visible: true, message: msg });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  useEffect(() => {
    monitorsRef.current = monitors;
  }, [monitors]);

  // Keep the dashboard clock synced to the viewer's current local time
  const [liveClock, setLiveClock] = useState('--:--:--');
  const [liveNow, setLiveNow] = useState(() => Date.now());
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setLiveNow(d.getTime());
      const s = d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setLiveClock(s);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const dbToMonitor = useCallback((p) => ({
    id: p._id,
    name: p.name,
    url: p.url,
    type: p.type || 'api',
    interval: p.interval || 5,
    status: p.lastStatus || 'up',
    createdAt: p.createdAt
      ? new Date(p.createdAt).getTime()
      : p.lastCheckedAt
        ? new Date(p.lastCheckedAt).getTime()
        : p.updatedAt
          ? new Date(p.updatedAt).getTime()
          : Date.now(),
    lastCheck: p.lastCheckedAt
      ? new Date(p.lastCheckedAt).getTime()
      : p.updatedAt
        ? new Date(p.updatedAt).getTime()
        : Date.now(),
    responseTime: p.lastResponseTime || 0,
    uptime: 100,
    history: genHistory(40, 0.95),
  }), []);

  const mergeMonitors = useCallback((previousMonitors, nextMonitors) => {
    const previousById = new Map(previousMonitors.map((monitor) => [monitor.id, monitor]));

    return nextMonitors.map((monitor) => {
      const previous = previousById.get(monitor.id);
      if (!previous) {
        return {
          ...monitor,
          history: buildHistoryFromPrevious([], monitor.status),
        };
      }

      const hasFreshCheck = monitor.lastCheck !== previous.lastCheck;
      return {
        ...monitor,
        history: hasFreshCheck
          ? buildHistoryFromPrevious(previous.history, monitor.status)
          : previous.history,
      };
    });
  }, []);

  const setMonitorLogs = useCallback((projectId, logs) => {
    if (!projectId) return;

    setPingLogsByMonitor((previous) => ({
      ...previous,
      [projectId]: Array.isArray(logs) ? logs.slice(-MAX_ACTIVITY_POINTS) : [],
    }));
  }, []);

  const pushPingLog = useCallback((projectId, entry) => {
    if (!projectId || !entry) return;

    setPingLogsByMonitor((previous) => ({
      ...previous,
      [projectId]: appendPingLogEntry(previous[projectId] || [], entry),
    }));
  }, []);

  const loadMonitorLogs = useCallback(async (projectId) => {
    if (!isSignedIn || !projectId) {
      return;
    }

    try {
      const logs = await getProjectLogs(getToken, projectId);
      setMonitorLogs(projectId, logs);
    } catch (err) {
      console.warn('Could not load monitor logs:', err);
    }
  }, [isSignedIn, getToken, setMonitorLogs]);

  const fetchMonitors = useCallback(async ({ silent = false } = {}) => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setMonitors([]);
      setLoadingProjects(false);
      setMonitorLoadMessage('Loading your monitors from database...');
      return;
    }

    const requestId = fetchMonitorsRequestIdRef.current + 1;
    fetchMonitorsRequestIdRef.current = requestId;

    if (!silent) {
      setLoadingProjects(true);
      setMonitorLoadMessage('Loading your monitors from database...');
    }

    let lastError = null;

    try {
      for (let attempt = 0; attempt <= MONITOR_FETCH_RETRY_DELAYS_MS.length; attempt += 1) {
        try {
          const data = await getProjects(getToken, { timeoutMs: MONITOR_FETCH_TIMEOUT_MS });
          const mappedMonitors = (Array.isArray(data) ? data : []).map(dbToMonitor);

          const monitorsWithUptime = await Promise.all(
            mappedMonitors.map(async (monitor) => {
              try {
                const uptimeData = await getProjectUptime(getToken, monitor.id, {
                  timeoutMs: MONITOR_UPTIME_TIMEOUT_MS
                });
                return {
                  ...monitor,
                  uptime: uptimeData.uptime || 100
                };
              } catch (err) {
                console.warn(`Could not fetch uptime for ${monitor.name}:`, err);
                return monitor;
              }
            })
          );

          if (fetchMonitorsRequestIdRef.current !== requestId) {
            return;
          }

          setMonitors((previousMonitors) => mergeMonitors(previousMonitors, monitorsWithUptime));
          return;
        } catch (err) {
          lastError = err;

          if (fetchMonitorsRequestIdRef.current !== requestId) {
            return;
          }

          const retryDelay = MONITOR_FETCH_RETRY_DELAYS_MS[attempt];
          if (!retryDelay) {
            break;
          }

          await wait(retryDelay);
        }
      }

      if (fetchMonitorsRequestIdRef.current !== requestId) {
        return;
      }

      console.error('fetchMonitors error:', lastError);
      if (!silent) {
        showToast('Could not load monitors. Please try again in a moment.');
      }
    } finally {
      if (!silent && fetchMonitorsRequestIdRef.current === requestId) {
        setLoadingProjects(false);
        setMonitorLoadMessage('Loading your monitors from database...');
      }
    }
  }, [isLoaded, isSignedIn, getToken, dbToMonitor, mergeMonitors, showToast]);

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  useEffect(() => {
    if (!monitors.length) {
      if (selectedMonitorId !== null) {
        setSelectedMonitorId(null);
      }
      setPingLogsByMonitor({});
      return;
    }

    const hasSelectedMonitor = monitors.some((monitor) => monitor.id === selectedMonitorId);
    if (!hasSelectedMonitor) {
      setSelectedMonitorId(monitors[0].id);
    }
  }, [monitors, selectedMonitorId]);

  const selectedMonitor = useMemo(
    () => monitors.find((monitor) => monitor.id === selectedMonitorId) || null,
    [monitors, selectedMonitorId]
  );

  const selectedPingLogs = useMemo(
    () => (selectedMonitorId ? pingLogsByMonitor[selectedMonitorId] || [] : []),
    [pingLogsByMonitor, selectedMonitorId]
  );

  useEffect(() => {
    if (!selectedMonitorId) return;
    loadMonitorLogs(selectedMonitorId);
  }, [selectedMonitorId, loadMonitorLogs]);

  useEffect(() => {
    if (!isSignedIn) return undefined;

    const refresh = () => {
      fetchMonitors({ silent: true });
    };

    const intervalId = setInterval(refresh, MONITOR_REFRESH_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSignedIn, fetchMonitors]);

  const applyPingResult = useCallback((monitor, result, { silent = false } = {}) => {
    const ok = result.status === 'up';
    const nextTimestamp = result.timestamp ? new Date(result.timestamp).getTime() : Date.now();

    setMonitors((previousMonitors) => previousMonitors.map((item) => {
      if (item.id !== monitor.id) return item;
      return {
        ...item,
        status: ok ? 'up' : 'down',
        responseTime: ok ? result.responseTime : 0,
        lastCheck: nextTimestamp,
        history: buildHistoryFromPrevious(item.history, ok ? 'up' : 'down'),
      };
    }));

    pushPingLog(monitor.id, {
      projectId: monitor.id,
      projectName: monitor.name,
      status: ok ? 'up' : 'down',
      responseTime: ok ? result.responseTime : 0,
      timestamp: result.timestamp || new Date().toISOString(),
    });

    if (!silent) {
      showToast(ok
        ? `${monitor.name}  ${result.responseTime}ms`
        : `${monitor.name} is down`);
    }
  }, [pushPingLog, showToast]);

  const startPingLoading = useCallback((monitorId) => {
    if (pingLoadingClearTimerRef.current) {
      window.clearTimeout(pingLoadingClearTimerRef.current);
      pingLoadingClearTimerRef.current = null;
    }
    pingLoadingStartedAtRef.current = Date.now();
    setPingLoadingId(monitorId);
  }, []);

  const stopPingLoading = useCallback((monitorId) => {
    const elapsed = Date.now() - pingLoadingStartedAtRef.current;
    const remaining = Math.max(0, PING_LOADING_MIN_MS - elapsed);

    if (pingLoadingClearTimerRef.current) {
      window.clearTimeout(pingLoadingClearTimerRef.current);
      pingLoadingClearTimerRef.current = null;
    }

    pingLoadingClearTimerRef.current = window.setTimeout(() => {
      setPingLoadingId((current) => (current === monitorId ? null : current));
      pingLoadingClearTimerRef.current = null;
    }, remaining);
  }, []);

  useEffect(() => {
    return () => {
      if (pingLoadingClearTimerRef.current) {
        window.clearTimeout(pingLoadingClearTimerRef.current);
      }
    };
  }, []);

  const runMonitorPing = useCallback(async (monitor, { silent = false, showSpinner = false } = {}) => {
    if (!monitor) return;
    if (!isSignedIn) {
      if (!silent) showToast('Please sign in first');
      return;
    }
    const existingTask = activePingTasksRef.current.get(monitor.id);
    if (existingTask) {
      if (showSpinner) {
        startPingLoading(monitor.id);
      }
      if (!silent) {
        showToast(`Pinging ${monitor.name}...`);
      }

      try {
        const result = await existingTask;
        if (!silent) {
          const ok = result.status === 'up';
          showToast(ok
            ? `${monitor.name} ${result.responseTime}ms`
            : `${monitor.name} is down`);
        }
      } catch (err) {
        if (!silent) {
          showToast(`Ping failed: ${err.message}`);
        }
      } finally {
        if (showSpinner) {
          stopPingLoading(monitor.id);
        }
      }
      return;
    }

    activePingIdsRef.current.add(monitor.id);
    const pingTask = pingUrl(getToken, monitor.url, monitor.id);
    activePingTasksRef.current.set(monitor.id, pingTask);

    if (showSpinner) {
      startPingLoading(monitor.id);
    }
    if (!silent) {
      showToast(`Pinging ${monitor.name}...`);
    }

    try {
      const result = await pingTask;
      applyPingResult(monitor, result, { silent });
    } catch (err) {
      console.error('pingUrl error:', err);
      if (!silent) {
        showToast(`Ping failed: ${err.message}`);
      }
    } finally {
      activePingIdsRef.current.delete(monitor.id);
      activePingTasksRef.current.delete(monitor.id);
      if (showSpinner) {
        stopPingLoading(monitor.id);
      }
    }
  }, [isSignedIn, getToken, applyPingResult, showToast, startPingLoading, stopPingLoading]);

  useEffect(() => {
    if (!isSignedIn || monitors.length === 0) return undefined;

    let cancelled = false;
    const timeoutIds = new Set();
    const cycleDuration = Math.max(
      AUTO_PING_BASE_INTERVAL_MS,
      monitors.length * AUTO_PING_STAGGER_MS + AUTO_PING_CYCLE_BUFFER_MS
    );

    const runCycle = () => {
      const snapshot = monitorsRef.current;
      snapshot.forEach((monitor, index) => {
        const timeoutId = window.setTimeout(() => {
          timeoutIds.delete(timeoutId);
          if (!cancelled) {
            void runMonitorPing(monitor, { silent: true, showSpinner: false });
          }
        }, index * AUTO_PING_STAGGER_MS);
        timeoutIds.add(timeoutId);
      });
    };

    runCycle();
    const intervalId = window.setInterval(runCycle, cycleDuration);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [isSignedIn, monitors.length, runMonitorPing]);

  const stats = useMemo(() => {
    // Count monitors by status
    // Online = any response received (up, warning, critical)
    // Down = no response (timeout, network error, etc)
    const onlineMonitors = monitors.filter(m => m.status !== 'down');
    const downMonitors = monitors.filter(m => m.status === 'down');

    // Calculate average response time across all responding monitors
    const totalResponseTime = onlineMonitors.reduce((a, m) => a + m.responseTime, 0);
    const avg = Math.round(totalResponseTime / Math.max(onlineMonitors.length, 1)) || 0;

    const weeklyAdded = getWeeklyAddedCount(monitors, liveNow);
    return { total: monitors.length, up: onlineMonitors.length, down: downMonitors.length, avg, weeklyAdded };
  }, [monitors, liveNow]);

  const [currentRange, setCurrentRange] = useState('1h');
  const isInitialDashboardLoading = !isLoaded || !isUserLoaded || (loadingProjects && monitors.length === 0);

  const handleAddMonitor = useCallback(async ({ name, url, type }, setModalError) => {
    if (!isSignedIn) {
      setModalOpen(false);
      openSignIn();
      return;
    }
    const normalizedUrl = normalizeMonitorUrl(url);
    const hasDuplicateMonitor = monitors.some((monitor) => normalizeMonitorUrl(monitor.url) === normalizedUrl);
    if (hasDuplicateMonitor) {
      setModalError('This monitor URL already exists.');
      return;
    }
    try {
      const result = await addProject(getToken, { name, url, type });
      const newMon = dbToMonitor(result.data);
      setMonitors(prev => [newMon, ...prev]);
      setSelectedMonitorId(newMon.id);
      setMonitorLogs(newMon.id, []);
      setModalOpen(false);
      showToast(`Monitor "${newMon.name}" added successfully`);
    } catch (err) {
      console.error('addProject error:', err);
      if (typeof setModalError === 'function') {
        setModalError(err.message || 'Failed to add monitor. Please try again.');
      } else {
        showToast(`${err.message}`);
      }
    }
  }, [isSignedIn, getToken, monitors, dbToMonitor, setMonitorLogs, showToast, openSignIn]);

  // FIX: Removed old handlePing + "void handlePing" hack — liveHandlePing is the single handler
  const handleDelete = useCallback(async (id) => {
    const m = monitors.find(x => x.id === id);
    if (!m) return;
    if (!isSignedIn) { showToast('Please sign in first'); return; }
    setDeleteConfirmMonitor(m);
  }, [monitors, isSignedIn, showToast]);

  const confirmDeleteMonitor = useCallback(async () => {
    const monitor = deleteConfirmMonitor;
    if (!monitor) return;

    const id = monitor.id;
    setDeletingMonitorId(id);
    try {
      await deleteProject(getToken, id);
      setMonitors(prev => prev.filter(x => x.id !== id));
      setPingLogsByMonitor((previous) => {
        if (!(id in previous)) return previous;
        const next = { ...previous };
        delete next[id];
        return next;
      });
      setDeleteConfirmMonitor(null);
      showToast('Monitor deleted');
    } catch (err) {
      console.error('deleteProject error:', err);
      showToast(`Delete failed: ${err.message}`);
    } finally {
      setDeletingMonitorId((current) => (current === id ? null : current));
    }
  }, [deleteConfirmMonitor, getToken, showToast]);

  const liveHandlePing = useCallback(async (id) => {
    const monitor = monitorsRef.current.find((item) => item.id === id);
    setSelectedMonitorId(id);
    await runMonitorPing(monitor, { silent: false, showSpinner: true });
  }, [runMonitorPing]);
  return (
    <React.Fragment>
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        alerts={createMonitorAlerts(monitors)}
        alertsReady={!loadingProjects}
        isDashboard
      />

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {isInitialDashboardLoading ? (
          <SkeletonHeaderHero />
        ) : (
          <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 animate-fade-in">
            <HeaderHero totalCount={stats.total} liveClock={liveClock} userName={user?.firstName} />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="group relative inline-flex items-center gap-2.5 h-11 px-5 rounded-xl font-semibold text-sm overflow-hidden bg-green-500 hover:bg-green-600 text-white border border-green-500/30 shadow-sm hover:shadow-md hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <svg className="relative !text-white w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="relative !text-white">Add Monitor</span>
              </button>
            </div>
          </div>
        )}

        <StatsCards total={stats.total} up={stats.up} down={stats.down} avg={stats.avg} weeklyAdded={stats.weeklyAdded} loadingProjects={loadingProjects} />

        {loadingProjects && (
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-medium animate-pulse">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {monitorLoadMessage}
          </div>
        )}

        {loadingProjects ? (
          <SkeletonChart />
        ) : selectedPingLogs.length > 0 ? (
          <ActivityChartV2
            theme={theme}
            currentRange={currentRange}
            onChangeRange={setCurrentRange}
            realLogs={selectedPingLogs}
            monitorName={selectedMonitor?.name}
            onRefresh={() => {
              if (selectedMonitorId) {
                loadMonitorLogs(selectedMonitorId);
              }
              fetchMonitors({ silent: true });
            }}
          />
        ) : (
          <div className="reference-panel p-6 md:p-8 mb-8 animate-fade-in">
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-9 4 18 3-9h4" />
                </svg>
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">No Activity Yet</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
                  {selectedMonitor
                    ? <>Click <span className="font-semibold text-emerald-500">Ping</span> on <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedMonitor.name}</span> to load its graph here.</>
                    : <>Add a monitor and click <span className="font-semibold text-emerald-500">Ping</span> to start recording real-time response data here.</>}
                </p>
              </div>
            </div>
          </div>
        )}

        {loadingProjects ? (
          <div className="reference-panel overflow-visible animate-fade-in">
            <div className="p-6 md:p-8">
              <div className="skeleton-box" style={{ width: 160, height: 22, marginBottom: 8 }} />
              <div className="skeleton-box" style={{ width: 280, height: 14 }} />
            </div>
            <div className="px-6 md:px-8 pb-8 pt-4 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonMonitorRow key={i} />
              ))}
            </div>
          </div>
        ) : (
          <MonitorsList
            monitors={monitors}
            search={search}
            filter={filter}
            onSearch={setSearch}
            onFilter={setFilter}
            onPing={liveHandlePing}
            onDelete={handleDelete}
            onAddMonitor={() => setModalOpen(true)}
            onPingLoadingId={pingLoadingId}
            deletingMonitorId={deletingMonitorId}
            selectedMonitorId={selectedMonitorId}
            onSelectMonitor={setSelectedMonitorId}
            liveNow={liveNow}
          />
        )}

        <footer className="relative mt-10 mb-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
          <div className="text-center text-xs text-gray-600 mt-12 font-mono pt-6 border-t border-gray-300 dark:border-gray-700">
            Built with PulseGuard v1.0 &mdash; Powered by Abhishek Yadav
          </div>
        </footer>
      </main>

      <DeleteConfirmModal
        open={Boolean(deleteConfirmMonitor)}
        monitorName={deleteConfirmMonitor?.name}
        deleting={deletingMonitorId === deleteConfirmMonitor?.id}
        onClose={() => setDeleteConfirmMonitor(null)}
        onConfirm={confirmDeleteMonitor}
      />

      <AddMonitorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddMonitor}
      />

      <Toast message={toast.message} visible={toast.visible} />
    </React.Fragment>
  );
}

export default PulseGuardDashboard;
